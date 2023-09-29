import path from 'path';
import electron,{ app, BrowserWindow, ipcMain, shell } from 'electron';
// import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { resolveHtmlPath } from './util';
import { store } from './ipcHandlers/storeHandler'
import { Worker } from 'worker_threads';
import * as fs from 'fs'
// IMPORT IPC HANDLERS
import "./ipcHandlers/storeHandler"
import "./ipcHandlers/discordHandlers"
import "./ipcHandlers/cacheHandlers"
import { createMessageWorkerThread } from './services/discordBot';
import { screen } from 'electron';
import { decksCacheStorage } from './services/discordBot/cache';

export let mainWindow: BrowserWindow | null = null;
var worker:any;
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const createWindow = async () => {

  const dialog = electron.dialog;

  dialog.showErrorBox = function(title, content) {
      console.log(`${title}\n${content}`);
  };

  const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const iconPath = process.platform === 'darwin' ? getAssetPath('macIcon.png') : getAssetPath('icon.png');

  mainWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 400,
    icon: iconPath,
    webPreferences: {
      javascript:true,
      nodeIntegration:true,
      nodeIntegrationInWorker: true,
      devTools:false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      webSecurity: false
    },
  });

  
  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.once('ready-to-show', () => {
    const { width } = screen.getPrimaryDisplay().workAreaSize;
    const devicePixelRatio = screen.getPrimaryDisplay().scaleFactor;
    const baseZoomFactor = 1.00; // Adjust this value as needed

    let zoomFactor = baseZoomFactor;

    if (devicePixelRatio > 1) {
      zoomFactor /= devicePixelRatio;
    }

    if (width <= 1900) {
      zoomFactor *= 0.7; // Small devices with normal/high zoom
    } else if (width <= 2500) {
      zoomFactor *= 1.0; // Normal devices with normal/high zoom
    } else if (width <= 3000) {
      zoomFactor *= 1.25; // Bigger devices with high zoom
    } else {
      zoomFactor *= 1.5; // Much bigger devices with high zoom
    }

    mainWindow.webContents.setZoomFactor(zoomFactor);
    mainWindow.show();
  });
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
  
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

async function createWorkerThread() {
    try {
      let logfile = "C:\\Users\\Public\\simplifylog.txt";
  
      const workerFile = app.isPackaged
        ? path.join(app.getAppPath(), "../", "src/main/services/worker.js")
        : path.join(__dirname, "services", "worker.js");
      console.log("********************rootPathrootPath******************", workerFile);
      fs.appendFileSync(logfile, workerFile);
      const worker = new Worker(workerFile);
  
      worker.on('message', async (msg: any, anymessage_type?: any) => {
        console.log("message Received", msg);
        fs.appendFileSync(logfile, msg);
      });
  
      worker.on('message', async (msg: any, parm1?: any, parm2?: any, parm3?: any, parm4?: any, parm5?: any) => {
        // console.log("message Received", msg)
        // fs.appendFileSync(logfile, msg)
        // log.info("in createWorkerThread =")
        // log.info(JSON.parse(msg))
  
        await createMessageWorkerThread(JSON.parse(msg));
  
        if (msg) {
          let message1 = JSON.parse(msg);
          if (message1?.type_message == "message-reaction") {
            log.info("message-reaction");
            log.info(message1);
            await decksCacheStorage.updateReactions(
              message1.serverId,
              message1.channelId,
              message1.memberId,
              message1.message_id,
              message1.reactions
            );
          } else if (message1?.type_message == "message-deleted") {
            log.info("message-deleted");
            log.info(message1?.messageId);
            await decksCacheStorage.deleteMessageFromAllDecks(message1?.messageId);
          } else {
            await createMessageWorkerThread(message1);
          }
        }
        // fs.appendFileSync(logfile, msg.toString()+"\n") 
        // fs.appendFileSync(logfile, "message"+"\n")  
      });
  
      let discordToken = store.get('discordToken');
      worker.postMessage(["send-auth-token", discordToken]);
      worker.on('error', (error: any) => {
        fs.appendFileSync(logfile, error.toString());
        fs.appendFileSync(logfile, "error" + "\n");
      });
      worker.on('exit', (code: any) => {
        fs.appendFileSync(logfile, code.toString() + "\n");
        fs.appendFileSync(logfile, "EXit" + "\n");
        createWorkerThread();
      });
    } catch (e) {
      log.info("error createWorkerThread");
      log.info(e);
    }
}

ipcMain.handle("launch-worker-thread", async (event) => {
  createWorkerThread()
})

ipcMain.on("sendReply", async (_event, channelID: string, messageID: string, messageContent: string) => {
  try{
    log.info("sendReply")
    worker.postMessage(["reply-message",channelID, messageID,messageContent]);
}catch(e){
 log.info(e)
}
}); 

let search_member ="C:\\Users\\Public\\search_member.json"
ipcMain.handle("search-member", async (_event, serverID: string, qry: string) => {
 return new Promise((resolve)=>{

 try{
    // store.set({"searched_members":[]})
    fs.writeFileSync(search_member,JSON.stringify({"searched_members":[]}))
    worker.postMessage(["search_members",serverID, qry,store.path]);
  // const members = await searchServerMembers(serverID, qry);
 setTimeout(()=>{
  let data =  fs.readFileSync(search_member,'utf-8')
  let parsedData = JSON.parse(data)
  log.info("search-member ====x" , parsedData.members);
  resolve(parsedData.members)
  },2000)
 
}catch(e){

  log.info(e)
  resolve([])
}
})
});

ipcMain.on("sendMessage", async (_event, deckID: string, messageContent: string) => {
  try{
    log.info("sendMessage")
  // let response = await sendMessageDiscord(deckID, messageContent)
  // log.info("sendMessage response")
  //   log.info(response)
  const [serverId, channelID, memberID] = deckID?.split("/");
  const channelId = channelID === "null" ? null : channelID;
  const memberId = memberID === "null" ? null : memberID;
  let discordToken  = store.get('discordToken');
  log.info("serverId, channelID, memberID =="+discordToken)
    log.info(serverId, channelID, memberId)
    worker.postMessage(["send-message",channelID,messageContent,discordToken]);
}catch(e){
 log.info(e)
}
});