import path from 'path';
import electron,{ app, BrowserWindow, ipcMain, webFrame, screen } from 'electron';
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
import { decksCacheStorage } from './services/discordBot/cache';

export let mainWindow: BrowserWindow | null = null;
var worker: Worker;
let mainZoomFactor;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
let membersCache: any[] = []
let logfile = "./Main-Log.txt";

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
    width: 1980,
    height: 1080,
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
mainWindow.webContents.openDevTools({mode:"detach"})
  const currentZoomFactor = mainWindow.webContents.getZoomFactor();
  store.set("mainZoomFactor", currentZoomFactor) 

  mainWindow.loadURL(resolveHtmlPath('index.html') as string);

  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    const webContents = mainWindow.webContents;
    const { width } = screen.getPrimaryDisplay().workAreaSize;
    let zoomFactor = 0.75; // Default zoom factor
  
    // SECTION: Conditions for setting zoomFactor:

    if (width <= 1900) {
      zoomFactor = 0.80; // Small devices with normal/high zoom
    } else if (width <= 2500) {
      zoomFactor = 1.0; // Normal devices with normal/high zoom
    } else if (width <= 3000) {
      zoomFactor = 1.25; // Bigger devices with high zoom
    } else {
      zoomFactor = 1.5; // Much bigger devices with high zoom
    }
  
    webContents.setZoomFactor(zoomFactor);
    mainWindow.show();
  });
  
  mainWindow.on('close', (event) => {
    mainWindow.close();
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
      log.info("app.getAppPath()==",app.getPath("logs"))
      const workerFile = app.isPackaged
        ? path.join(app.getAppPath(), "../", "src/main/services/worker.js")
        : path.join(__dirname, "services", "worker.js");
      worker = new Worker(workerFile);
   //worker.postMessage(["search_path",path.join(app.getPath("logs"),'search_member.json')])
      worker.on('message', async (msg: any, parm1?: any, parm2?: any, parm3?: any, parm4?: any, parm5?: any) => { 
       
  
      // if(msg) { 
        // if(parm1 =="searched_memberse_data"){
      //    log.info("searched_memberse_data")
      //    fs.writeFileSync(search_member, JSON.stringify({"searched_members":msg}))
          
      //  }else{}

         
          if(msg){
          let message1 = JSON.parse(msg);
        //  log.info("Message *******************> ",message1)
          if (message1?.type_message == "message-reaction") {
            log.info("message-reaction");
            await decksCacheStorage.updateReactions(
              message1.serverId,
              message1.channelId,
              message1.memberId,
              message1.message_id,
              message1.reactions
            );
          } else if (message1?.type_message == "message-deleted") {
            await decksCacheStorage.deleteMessageFromAllDecks(message1?.messageId);
          } else if (message1?.newMembers ) {
            fs.writeFileSync(search_member, JSON.stringify({"searched_members":message1?.newMembers}))
          } else {
            await createMessageWorkerThread(message1);
   
          }
       }
      });
  
      let discordToken = store.get('discordToken');
      worker.postMessage(["send-auth-token", discordToken]);
      worker.on('error', (error: any) => {
        //log.info("error",error)
      });
      worker.on("messageerror",(err:any)=>{
//log.info("messageerr",err)

      })
      worker.on('exit', (code: any) => {
      log.info("worker Exit")
       log.info(code)
        createWorkerThread();
      });
    } catch (e) { log.info(e)    }
}

ipcMain.handle("launch-worker-thread", async (event) => {
  createWorkerThread()
})

ipcMain.on("sendReply", async (_event, channelID: string, messageID: string, messageContent: string) => {
  try{
    worker.postMessage(["reply-message",channelID, messageID,messageContent]);
}catch(e){
}
}); 

/*
ipcMain.handle("search-member", async (_event, serverID: string, qry: string) => {
 return new Promise((resolve)=>{
    try{
      worker.postMessage(["search_members",serverID, qry]);   
      worker.on('message', async (msg: any, parm1?: any, parm2?: any, parm3?: any, parm4?: any, parm5?: any) => { 
        if (msg) {
          let message1 = JSON.parse(msg);
          log.info("Message from Worker", JSON.stringify(message1))
          if (message1?.type_message == "searched-members") {
              log.info("searched-members: ", message1.membersCache)
              resolve(message1.membersCache);
          }
        }
      });
    }catch(e){
      log.info(e)c;ear
      resolve(null)
    }
  })
});
*/

let search_member: string;
if (process.platform === 'win32') {
  search_member = "C:\\Users\\Public\\search_member.json";
} else if (process.platform === 'darwin') {
  search_member = path.join( app.getPath("logs"),'search_member.json');
} else {
  search_member = './search_member.json';
}

ipcMain.handle("search-member", async (_event, serverID: string, qry: string) => {
 return new Promise((resolve)=>{
    try{
      fs.writeFileSync(search_member,JSON.stringify({"searched_members":[]}))
      worker.postMessage(["search_members",serverID, qry]);
      setTimeout(()=>{
        let data =  fs.readFileSync(search_member,'utf-8')
        let parsedData = JSON.parse(data)
        log.info("search-member ====x" , parsedData.searched_members);
        if (parsedData.searched_members != undefined && parsedData.searched_members.length > 0) {
            resolve(parsedData.searched_members)
        }
      },2000)
  
    }catch(e){
      log.info(e)
      resolve([])
    }
  })
});

ipcMain.on("sendMessage", async (_event, deckID: string, messageContent: string) => {
  try{
  const [serverId, channelID, memberID] = deckID?.split("/");
  const channelId = channelID === "null" ? null : channelID;
  const memberId = memberID === "null" ? null : memberID;
  let discordToken  = store.get('discordToken');
    worker.postMessage(["send-message",channelID,messageContent,discordToken]);
}catch(e){
}
});
