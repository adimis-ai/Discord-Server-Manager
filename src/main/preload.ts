import { log } from 'console';
import { contextBridge, ipcRenderer, IpcRendererEvent, clipboard } from 'electron';
import * as fs from 'fs'
export type Channels =
  | "start-discord-service"
  | "stop-discord-service"
  | "get-server"
  | "open-url"
  | "search-member"
  | "get-latest-messages"
  | "message-update"
  | "getServer-response"
  | "search-member-name"
  | "get-channel-messages"
  | "getLatestMessages-response"
  | "notifications-update"
  | "sendMessage"
  | "delete-deck"
  | "sendReply"
  | "authenticate-discord"
  | "load-more-messages"
  | "authentication-successful"
  | "authenticate-discord-backend"
  | "clear_message_cache"
  | "clear_server_cache"
  | "get-latest-null-channel-messages"
  | "last-offset-for-deckID"
  | "MEMBERS_RECIVED"
  
const electronHandler = {
  ipcRenderer: {
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    send(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    openUrl(url: string) {
      return ipcRenderer.invoke("open-url", url);
    },
    discordBot: {
      startDiscordService(token: string) {
        return ipcRenderer.invoke("start-discord-service", token);
      },
      stopDiscordService() {
        ipcRenderer.invoke("stop-discord-service");
      },
      getServer() {
        const serverDataResult = async () => {
          const serverData = await ipcRenderer.invoke("get-server");
          return serverData;
        }
        return serverDataResult();
      },
      async searchMember(serverID: string, qry: string) {
        const members = await ipcRenderer.invoke("search-member", serverID, qry);
        return members
      },
      getLatestMessages(deckID: string, offset: string) :any{
        return new Promise((resolve,reject)=>{
         resolve(ipcRenderer.invoke("get-latest-messages", deckID, offset));
        })
      },
      getLatestMessagesNew(deckID: string, offset: string) {
        return ipcRenderer.invoke("get-latest-messages-new", deckID, offset);
      },
      getLatestNullChannelMessages(deckID: string, offset: string) {
        return ipcRenderer.invoke("get-latest-null-channel-messages", deckID, offset);
      },
      getChannelMessages(deckID: string, offset: string) {
        return ipcRenderer.invoke("get-channel-messages", deckID, offset);
      },
    
      deleteMessagesCache(deckID: string) {
        ipcRenderer.invoke("delete-messages", deckID);
      },
      loadMoreMessages(deckID: string, offset: string) {
        return ipcRenderer.invoke("load-more-messages", deckID, offset);
      },
      updateNotifications(deckID: string, enabled: boolean) {
        ipcRenderer.send("notifications-update", deckID, enabled);
      },      
      sendMessage(deckID: string, messageContent: string) {
        ipcRenderer.invoke("sendMessage", deckID, messageContent);
      },
      sendReply(channelID: string, messageID: string, messageContent: string) {
        ipcRenderer.invoke("sendReply", channelID, messageID, messageContent);
      },
      authenticateDiscord() {
        ipcRenderer.invoke("launch-worker-thread");
        return ipcRenderer.invoke("authenticate-discord-backend");
       

      },
      authenticateDiscordSilent() {
        ipcRenderer.invoke("launch-worker-thread");
        return ipcRenderer.invoke("authenticate-discord-backend-silent");
      },
    },
    cache: {
      getLastOffset(deckID: string) {
        const lastOffset = async () => {
          const lastOffsetValue = await ipcRenderer.invoke("last-offset-for-deckID", deckID);
          return lastOffsetValue;
        }
        return lastOffset();
      },
      deleteDeck(deckID: string) {
        ipcRenderer.invoke("delete-deck", deckID);
      },
      searchMemberName(memberID: string) {
        return ipcRenderer.invoke("search-member-name", memberID)
      },
      clearMessageCache() {
        ipcRenderer.invoke("clear_message_cache")
      },
      clearServerCache() {
        ipcRenderer.invoke("clear_server_cache")
      }
    }
  },
  store: {
    get(key: string) {
      return ipcRenderer.sendSync('electron-store-get', key);
    },
    set(key: string, val: any) {
      ipcRenderer.send('electron-store-set', key, val);
    },
    delete(key: string) {
      ipcRenderer.send('electron-store-delete', key);
    },
    has(key: string) {
      return ipcRenderer.sendSync('electron-store-has', key);
    },
    reset() {
      ipcRenderer.send('electron-store-reset');
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
