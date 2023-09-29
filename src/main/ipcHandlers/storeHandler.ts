import Store from 'electron-store';
import { ipcMain } from 'electron';

export const store = new Store();

// IPC listener for electron Store
ipcMain.on('electron-store-get', async (event, key) => {
    try{
    event.returnValue = store.get(key); 
}catch(e){
        console.log(e)
      }
});
  
ipcMain.on('electron-store-set', async (event, key, val) => {
    try{
    store.set(key, val);
}catch(e){
    console.log(e)
  }
});

ipcMain.on('electron-store-delete', async (event, key) => {
    try{
    store.delete(key);
}catch(e){
    console.log(e)
  }
});

ipcMain.on('electron-store-has', async (event, key) => {
   
   try{ event.returnValue = store.has(key);
}catch(e){
    console.log(e)
  }
});

ipcMain.on('electron-store-reset', async () => {
    try{
    store.clear();
}catch(e){
    console.log(e)
  }
});