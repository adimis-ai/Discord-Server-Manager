import { ipcMain, BrowserWindow, app } from 'electron';
import { stopDiscordService, deleteDeckfromCache, startDiscordService, getMemberMessagesDataController, sendMessageDiscord, sendMessageReply, notificationsEnabledMap, loadMore, getMemberNameById, createMessageWorkerThread } from '../services/discordBot'
import { getMessagesDataController, getServerDataController, searchServerMembers, deleteDeck } from '../services/discordBot';
import { authenticateDiscordBackend, authenticateDiscordBackendSilent } from '../authManager/discordAuth'
import path from 'path';
const log = require('electron-log');


ipcMain.handle('authenticate-discord-backend', async (event) => {
  try {
    log.info('authenticate-discord-backend');
    const result = await authenticateDiscordBackend();
    return result;
  } catch (error) {
    log.info(error);
    console.error('Error during Discord authentication:', error);
    return false;
  }
});

ipcMain.handle('authenticate-discord-backend-silent', async (event) => {
  try {
    log.info('authenticate-discord-backend');
    const result = await authenticateDiscordBackendSilent();
    return result;
  } catch (error) {
    log.info(error);
    console.error('Error during Discord authentication:', error);
    return false;
  }
});



ipcMain.handle("stop-discord-service", async (_event) => {
 
 try{ await stopDiscordService();
}catch(e){
 log.info(e)
}
});

ipcMain.handle("get-server", async () => {
  try{
  const serverData = await getServerDataController();
  return serverData;
}catch(e){
 log.info(e)
}
});

// ipcMain.handle("search-member", async (_event, serverID: string, qry: string) => {
//   try{
//     log.info("search-member");
//   const members = await searchServerMembers(serverID, qry);
//   return members;
// }catch(e){

//   log.info(e)
// }
// });

ipcMain.handle("search-member-name", async (_event, memberID: string) => {
  try{
  const memberName = await getMemberNameById(memberID)
  return memberName;
}catch(e){
 log.info(e)
}
});

ipcMain.handle("get-latest-messages", async (_event, deckID: string, offset: string) => {
  return new Promise(async(resolve,reject)=>{
  try{
  const [serverID, channelID, memberID] = deckID?.split("/");
  const adjustedChannelID = channelID === "null" ? null : channelID;
  const adjustedMemberID = memberID === "null" ? null : memberID;
  const messages = await getMessagesDataController(serverID, adjustedChannelID, adjustedMemberID, offset);
  resolve(messages);
}catch(e){
 log.info(e)
 resolve(null)
}
})
});  



ipcMain.handle("get-latest-null-channel-messages", async (_event, deckID: string, offset: string) => {
  try{
  const [serverID, channelID, memberID] = deckID.split("/");
  const adjustedMemberID = memberID === "null" ? null : memberID;
  const messages = await getMemberMessagesDataController(serverID, null, adjustedMemberID, offset);
  return messages;
}catch(e){
 log.info(e)
}
});

ipcMain.handle("load-more-messages", async (_event, deckID: string, offset: string) => {
  try{
  const [serverID, channelID, memberID] = deckID.split("/");
  const adjustedChannelID = channelID === "null" ? null : channelID;
  const adjustedMemberID = memberID === "null" ? null : memberID;
  const messages = await loadMore(serverID, adjustedChannelID, adjustedMemberID, offset);
  return messages;
}catch(e){
 log.info(e)
}
});

ipcMain.handle("get-channel-messages", async (_event, deckID: string, offset: string) => {
  try{
  const [serverID, channelID, memberID] = deckID.split("/");
  const adjustedChannelID = channelID === "null" ? null : channelID;
  const adjustedMemberID = memberID === "null" ? null : memberID;
  const messages = await loadMore(serverID, adjustedChannelID, adjustedMemberID, offset);
  return messages;
}catch(e){
 log.info(e)
}
});



ipcMain.handle("delete-deck", async (_event, deckID: string) => {
  try{
  deleteDeckfromCache(deckID);
}catch(e){
 log.info(e)
}
});  

ipcMain.handle("start-discord-service", async (_event, token: string) => {
 try{ await startDiscordService(token);
}catch(e){
 log.info(e)
}
});  

ipcMain.on("notifications-update", (_event, deckId: string, enabled: boolean) => {
  try{
    log.info("notifications-update"+ deckId)
  notificationsEnabledMap[deckId] = enabled;
}catch(e){
 log.info(e)
}
});

// ipcMain.on("sendMessage", async (_event, deckID: string, messageContent: string) => {
//   try{
//     log.info("sendMessage")
//   let response = await sendMessageDiscord(deckID, messageContent)
//   log.info("sendMessage response")
//     log.info(response)
// }catch(e){
//  log.info(e)
// }
// });

// ipcMain.on("sendReply", async (_event, channelID: string, messageID: string, messageContent: string) => {
//   try{
// await sendMessageReply(channelID, messageID, messageContent).catch(error => {
//     console.error('Error sending message:', error);
// });
// }catch(e){
//  log.info(e)
// }
// }); 

ipcMain.handle('open-url', async (event, url: string) => {
  try{
    const openUrlWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      webPreferences: {
        nodeIntegration: false,
      },
    });
  
    openUrlWindow.loadURL(url);
  
    openUrlWindow.on('ready-to-show', () => {
      openUrlWindow.show();
    });
  
    openUrlWindow.on('closed', () => {
    });
  }catch(e){
   log.info(e)
  }
});
  