import { ipcMain } from 'electron';
import { decksCacheStorage, serverDataCacheStorage } from '../services/discordBot/cache';

ipcMain.handle('last-offset-for-deckID', (_event, deckID: string) => {
    try{
    return decksCacheStorage.getLastOffset(deckID);
}catch(e){
    console.log(e)
  }
});

ipcMain.handle('clear_message_cache', (_event) => {
    try{
    return decksCacheStorage.clearCache();
}catch(e){
    console.log(e)
  }
});

ipcMain.handle('clear_server_cache', (_event) => {
    try{
    return serverDataCacheStorage.clearCache();
}catch(e){
    console.log(e)
  }
});