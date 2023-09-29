import { discordOauthURL } from '../config/env';
import { store } from '../ipcHandlers/storeHandler';
import { delay } from '../utils/helperFunctions';
import { clipboard } from 'electron';
import { mainWindow } from '../main';
import { resolveHtmlPath } from '../util';
import { startDiscordService } from '../services/discordBot';
import log from 'electron-log';

const jsCode = `
function executeWhenAvailable() {
  if (window.webpackChunkdiscord_app !== undefined) {
    window.webpackChunkdiscord_app.push([
      [Math.random()],
      {},
      req => {
        for (const m of Object.keys(req.c)
          .map(x => req.c[x].exports)
          .filter(x => x)) {
          if (m.default && m.default.getToken !== undefined) {
            return navigator.clipboard.writeText(m.default.getToken());
          }
          if (m.getToken !== undefined) {
            return navigator.clipboard.writeText(m.getToken());
          }
        }
      },
    ]);
    console.log('%cWorked!', 'font-size: 50px');
    console.log('%cYou now have your token in the clipboard!', 'font-size: 16px');
  } else {
    setTimeout(executeWhenAvailable, 500); // Check again after 500ms
  }
}

executeWhenAvailable();
`;  

export const authenticateDiscordBackend = async () => {
  
    mainWindow?.loadURL(discordOauthURL);

    const tokenCheckInterval = setInterval(async () => {
      const discordToken = await store.get('discordToken');

      if (discordToken !== null && discordToken !== "null" && discordToken !== undefined && discordToken !== "") {
        clearInterval(tokenCheckInterval);
        await startDiscordService(discordToken as string)
        const url = resolveHtmlPath('index.html')
        console.log("url from authenticateDiscordBackend", url)
        console.log("access_token from authenticateDiscordBackend", store.get("access_token"))
        console.log("refresh_token from authenticateDiscordBackend", store.get("refresh_token"))
        mainWindow.loadURL(url); 
        console.log("access_token from authenticateDiscordBackend", store.get("access_token"))
        console.log("refresh_token from authenticateDiscordBackend", store.get("refresh_token"))
      } else {
        clipboard.clear()
        await mainWindow?.webContents.executeJavaScript(jsCode);
        await delay(500)
        const discordToken = await clipboard.readText();
        console.log("\n## === DISCORD TOKEN === ##\n")
        console.log('token from authDiscord: ', discordToken)
        console.log("\n## ===================== ##\n")
        await store.delete("discordToken"); // Clear existing values
        await store.set("discordToken", discordToken);
      }
    }, 1000);

    return true;
};


export const authenticateDiscordBackendSilent = async () => {
  return new Promise(async (resolve,reject)=>{
  const discordToken = await store.get('discordToken');
  await startDiscordService(discordToken as string)
  resolve(null)
  
})
};