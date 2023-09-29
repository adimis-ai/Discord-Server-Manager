import { MessageData } from "../types";
import { updateMessage } from '../../reducers/deckManager';

export async function fetchAndUpdateMessages(deckId: string, offset: string, dispatch: Function): Promise<MessageData[]> {
  // console.log("fetchAndUpdateMessages: called with deckId: ", deckId, " and offset: ", offset);
  const [serverID, channelID, memberID] = deckId.split("/");

  try {
    let messages: MessageData[];

    if (channelID === null) {
      messages = await window.electron.ipcRenderer.discordBot.getLatestNullChannelMessages(deckId, offset);
    } else {
      messages = await window.electron.ipcRenderer.discordBot.getLatestMessages(deckId, offset);
    }
    messages.forEach((message) => {
      dispatch(updateMessage({ deckId, updatedMessage: message }));
    });
    
    return messages;
  } catch (error) {
    return [];
  }
}
