export async function sendMessage(deckID: string, messageContent: string) {
  await window.electron.ipcRenderer.send("sendMessage", deckID, messageContent);
  return `${deckID}: ${messageContent}`;
}

export async function sendReply(channelID: string, messageID: string, messageContent: string) {
  await window.electron.ipcRenderer.send("sendReply", channelID, messageID , messageContent);
  return `Message = ${channelID}/${messageID}$: {messageContent}`;
}

export async function openDiscordUrl(url: string) {
  await window.electron.ipcRenderer.openUrl(url)
}

export async function getServer(): Promise<any> {
  const serverData = await window.electron.ipcRenderer.discordBot.getServer();
  return serverData
}

export async function deleteMessagesCache(deckID: string) {
  await window.electron.ipcRenderer.cache.deleteDeck(deckID)
}

export async function searchMember(serverID: string, qry: string) {
  const members = await window.electron.ipcRenderer.discordBot.searchMember(serverID, qry);
  return members
}
