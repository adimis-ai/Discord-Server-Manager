import axios, { AxiosResponse } from 'axios';
import {
  Client,
  Message,
  GuildChannel,
  Guild,
  TextChannel,
  MessageReaction,
  User,
} from 'discord.js-selfbot-v13';
import {
  createDeckID,
  delay,
  printData,
  replaceAsync,
  fetchURLGenerator,
  fetchURLGeneratorNew,
} from '../utils/helperFunctions';
import {
  decksCacheStorage,
  serverDataCacheStorage,
  ServerDataCache,
  MessageData,
  DecksCache,
} from '../services/discordBot/cache';
import { Notification } from 'electron';
import { store } from '../ipcHandlers/storeHandler';
import fs from 'fs';
import { rejects } from 'assert';
import { resolve } from 'path';
import { Url } from 'url';
const log = require('electron-log');
const client = new Client({
  checkUpdate: false,
});

let latestCall = 0;
let last_req;
const MAX_RETRIES = 5;
export let notificationsEnabledMap: { [deckId: string]: boolean } = {};
let isClientReady = false;

BigInt.prototype['toJSON'] = function () {
  return this.toString();
};

export async function startDiscordService(
  token: string | undefined
): Promise<void> {
  try {
    await client.login(token);
    const userAvatar = await client?.user?.avatarURL();
    const userName = await client?.user?.username;
    const userBio = await client?.user?.bio;
    const userID = await client?.user?.id;
    const userBanner = await client?.user?.bannerURL();
    const userDiscriminator = await client?.user?.discriminator;
    store.set('userName', userName);
    store.set('userAvatar', userAvatar);
    store.set('userBio', userBio);
    store.set('userID', userID);
    store.set('userBanner', userBanner);
    store.set('userDiscriminator', userDiscriminator);
    await getServerData();
  } catch (e) {
    console.log(e);
  }
}

export async function stopDiscordService() {
  try {
    console.log('Stopping Discord Service....');
    await client.destroy();
    console.log('Stopped Discord Service successfully');
  } catch (e) {
    console.log(e);
  }
}

export async function sendMessageDiscord(
  deckID: string,
  messageContent: string
): Promise<void> {
  return new Promise(async (resolve, rejects) => {
    try {
      const [serverId, channelID, memberID] = deckID?.split('/');
      const channelId = channelID === 'null' ? null : channelID;
      const memberId = memberID === 'null' ? null : memberID;
      if (!serverId) {
        //   throw new Error("Server ID is required");
        resolve(null);
      }

      const guild = client?.guilds?.cache?.get(serverId);
      if (!guild) {
        //   throw new Error("Server not found");
        resolve(null);
      }
      if (channelId) {
        const channel = guild?.channels?.cache?.get(channelId) as TextChannel;
        if (!channel || channel.type !== 'GUILD_TEXT') {
          throw new Error('Channel not found or not a text channel');
        }

        await channel.send({ content: messageContent });
        resolve(null);
      } else {
        const channels = guild?.channels?.cache?.filter(
          (channel) => channel.type === 'GUILD_TEXT'
        );
        for (const channel of channels.values()) {
          await (channel as TextChannel).send(messageContent);
        }
        resolve(null);
      }
    } catch (e) {
      resolve(null);
    }
  });
}

export async function sendMessageReply(
  channelId: string,
  messageId: string,
  messageContent: string
): Promise<any> {
  return new Promise(async (resolve, rejects) => {
    try {
      if (!channelId) {
        //   throw new Error("Channel ID is required");
        resolve(null);
      }

      const channel = client?.channels?.cache?.get(channelId) as TextChannel;
      if (!channel || channel.type !== 'GUILD_TEXT') {
        //   throw new Error("Channel not found or not a text channel");
        resolve(null);
      }

      const message = await channel?.messages?.fetch(messageId);
      if (!message) {
        //   throw new Error("Message not found");
        resolve(null);
      }

      resolve(
        await channel.send({
          content: messageContent,
          reply: {
            messageReference: message,
            failIfNotExists: false,
          },
        })
      );
    } catch (e) {
      console.log(e);
    }
  });
}

export async function deleteDeckfromCache(deckID: string) {
  try {
    decksCacheStorage.deleteDeck(deckID);
  } catch (e) {
    console.log(e);
  }
}

//SECTION - GET SERVER DATA FUNCTIONS
async function getServerData(): Promise<ServerDataCache[]> {
  // Get the cached data
  try {
    let data = serverDataCacheStorage.getServers();

    // If there's no data in the cache, generate it
    if (data.length === 0) {
      client?.guilds?.cache?.forEach((guild: Guild) => {
        const serverId = guild?.id;
        const serverName = guild?.name;
        const channels = guild?.channels?.cache
          .filter((channel) => channel?.type === 'GUILD_TEXT')
          .map((channel) => ({
            channelId: (channel as TextChannel)?.id,
            channelName: (channel as TextChannel)?.name,
          }));
        const members = guild.members.cache.map((member) => ({
          memberId: member?.id,
          memberName: member?.displayName,
        }));

        // Cache the server data
        serverDataCacheStorage.setServer(serverId, {
          serverId,
          serverName,
          channels,
          members,
        });

        // Add the server data to the result
        data.push({
          serverId,
          serverName,
          channels,
          members,
        });
      });
    }

    return data;
  } catch (e) {
  }
}

async function getUserAvatarURL(userId, message) {
  return new Promise(async (resolve, reject) => {
    userId = userId?.toString();
    let user = client?.users?.cache?.get(userId);
    try {
      if (!user) user = await client?.users?.fetch(userId);
      let url = user?.avatarURL();
      if (!url) url = user?.defaultAvatarURL
      resolve(url);
    } catch (e) {
      resolve(message.newavatarURL);
    }
  });
}

async function getUserAvatarURLNew(userId, message) {
  return new Promise(async (resolve, reject) => {
    userId = userId?.toString();
    let user = client?.users?.cache?.get(userId);
    try {
      if (!user) user = await client?.users?.fetch(userId);
      let url = user?.avatarURL();
      if (!url) url = user?.defaultAvatarURL;
      resolve(url);
    } catch (e) {
      resolve(message.newavatarURL);
    }
  });
}

async function getReplyMessage(userId, singleMessage,messages) {
  try {
  return new Promise(async(resolve, reject) => {
    userId = userId?.toString();
    let user = client?.users?.cache?.get(userId);
    
      if (!user) user = await client?.users?.fetch(userId);
      let url = user?.avatarURL();
      if (!url) url = user?.defaultAvatarURL;
      singleMessage.avatarURL =url
    if (singleMessage?.type == '19') {
     
      let filteredMessages = messages.filter((item=>{
          if(item.id==singleMessage?.message_reference?.message_id){
              return true
          }else{
              return false
          }
      }))
      // content: 'reply1',
      // authorId: '1114129452381786133',
      // authorName: 'khabib'
      singleMessage.reply={}
      singleMessage.reply.content = filteredMessages[0]?.content
      singleMessage.reply.authorId=filteredMessages[0]?.author.id
      singleMessage.reply.authorName=filteredMessages[0]?.author.username
      resolve(singleMessage)
    }else{


      resolve(singleMessage)
    }
  });
}catch(e){
}
}

async function getMessage(serverId, channelId, msgId) {
  try {
    if (channelId && serverId && msgId) {
      channelId = channelId?.toString();
      let channel = client?.channels?.cache?.get(channelId) as TextChannel;

      if (!channel) return null;

      let replyMsg;
      try {
        replyMsg = await channel?.messages?.fetch(msgId);
      } catch (e) {
        console.error(
          `Could not fetch the message with id ${msgId}. Error: ${e?.message}`
        );
        return null; // You might want to return a specific structure or error code here.
      }

      let newReplyMsg = {
        authorId: replyMsg?.author ? replyMsg?.author?.id : null,
        authorName: replyMsg?.author ? replyMsg?.author?.username : null,
        content: replyMsg?.content,
      };

      let server = !!replyMsg?.guild
        ? replyMsg?.guild
        : client?.guilds?.cache?.get(serverId);

      if (!server) return null;

      replyMsg.content = await replaceAsync(
        replyMsg?.content,
        /<@(\d+)>/g,
        async (match, g1) => {
          let user = client?.users?.cache?.get(g1);
          if (!user) user = await client?.users?.fetch(g1);
          return '@' + user?.username;
        }
      );
      replyMsg.content = await replaceAsync(
        replyMsg?.content,
        /<#(\d+)>/g,
        async (match, g1) => {
          if (!!server) {
            let channel = server?.channels?.cache?.get(g1);
            if (!channel) channel = await server?.channels?.fetch(g1);
            return '#' + channel?.name;
          } else {
            return '';
          }
        }
      );
      replyMsg.content = await replaceAsync(
        replyMsg?.content,
        /<@&(\d+)>/g,
        async (match, g1) => {
          if (!!server) {
            let role = server?.roles?.cache?.get(g1);
            if (!role) role = await server?.roles?.fetch(g1);
            return '@' + role?.name;
          } else {
            return '';
          }
        }
      );
      return {
        content: newReplyMsg?.content,
        authorId: newReplyMsg?.authorId,
        authorName: newReplyMsg?.authorName,
      };
    }
  } catch (e) {
  }
}

export const addMsgProps = async (m: any, serverId: string): Promise<any> => {
  return new Promise(async (resolve, rejects) => {
    try {
      if (!m) resolve(null);

      // Filter out attachments that have the content type of image and map their URLs into an 'images' array.
      if (m?.attachments.length > 0) {
        m.images = m?.attachments
          ?.filter(
            (a) =>
              (a.contentType != null && a?.contentType?.startsWith('image')) ||
              (a.content_type != null && a.content_type.startsWith('image'))
          )
          .map((a) => a.url);
      } else {
        m.images = [];
      }

      // If the author of the message has a nickname, assign it to authorName. If not, assign the author's username to authorName.
      if (m?.author) {
        m.authorName = m?.author?.nickname;
        if (!m.authorName) m.authorName = m?.author?.username;
      }
      if (!m.authorName) {
        m.authorName = m?.newauthor?.username;
      }

      // If the author exists, assign the author's id to authorId.
      if (!!m.author) {
        if (m.authorId) {
          m.authorId = m.authorId;
        } else {
          m.authorId = m.author.id;
        }
      } else if (m.authorId) {
        m.authorId = m.authorId;
      }

      // If the message has an associated channel, assign the channel id and name to the respective properties.
      // If the channel is not directly associated with the message, get it from the client's cache or fetch it from the server.
      if (!!m.channel) {
        if (m?.channelId) {
          m.channelId = m?.channelId;
        } else {
          m.channelId = m?.channel.id;
        }

        m.channelName = m?.channel?.name;
      } else if (m?.channelId) {
        m.channelId = m?.channelId;
      } else {
        m.channelId = m?.channel_id;
        // let channel = client?.channels?.cache?.get(m.channel_id);
        // if (!channel) channel = await client?.channels?.fetch(m.channel_id);
        // if (channel && channel instanceof GuildChannel) {
        //   // Check if it's GuildChannel
        //   m.channelName = channel?.name;
        //   let server = !!m.guildId
        //     ? m.guildId
        //     : client?.guilds?.cache?.get(serverId);
        //   let member;
        //   if (!!server) {
        //     member = server?.members?.cache?.get(m.authorId);
        //     if (!member) member = await server?.members?.fetch(m?.authorId);
        //   }
        // }
      }

      // Get the server (guild) information. If the server information doesn't exist in the message, fetch it from the client's cache using the serverId.
      let server = !!m.guild ? m.guild : client?.guilds?.cache?.get(serverId);
      m.guildId = server?.id;

      // If the member who sent the message exists, get their role color. If not, try to fetch it from the server. If that's also not possible, set the role color to "null".
      m.roleColor = !!m.member ? m?.member?.displayHexColor : 'null';
      if (m.roleColor == 'null' && !!server) {
        let member = server?.members?.cache?.get(m.authorId);
        try {
          if (!member) member = await server?.members?.fetch(m?.authorId);
          m.roleColor = member?.displayHexColor;
        } catch (e) {}
      }

      // If the message is a reply to another message, fetch the original message that this one is replying to.
      let replyMsg = m.message_reference ? m.message_reference : m.reference;
      if (replyMsg != undefined) {
        let fetchedMsg = await getMessage(
          serverId,
          replyMsg.channel_id || replyMsg.channelId,
          replyMsg.message_id || replyMsg.messageId
        );
        if (fetchedMsg === null) {
          // Handle the error, you might want to set m.reply to a default value or just skip this message.
        } else {
          m.reply = fetchedMsg;
        }
      }

      m.reply = m.replyMessageObj;

      // If the createdTimestamp is not set, try to set it using the timestamp. If the createdTimestamp is a number, convert it to a string.
      if (!m.createdTimestamp && m.timestamp)
        m.createdTimestamp = new Date(m?.timestamp).toString();
      if (typeof m.createdTimestamp == 'number')
        m.createdTimestamp = new Date(m?.createdTimestamp).toString();

      // If the avatarURL is not set, get the URL of the user's avatar.
      if (!m.avatarURL) m.avatarURL = await getUserAvatarURL(m.authorId, m);
      if (!m.avatarURL) {
        m.avatarURL = m.newavatarURL;
      }

      // // Replace user mentions in the content with the corresponding usernames.
      m.content = await replaceAsync(
        m?.content,
        /<@(\d+)>/g,
        async (match, g1) => {
          if (g1) {
            // let user = client?.users?.cache?.get(g1)
            // // If the user isn't in the cache, fetch the user's information using the user ID (g1)
            // if (!user) user = await client?.users?.fetch(g1)
            // Return the username with an "@" prefix, replacing the original mention in the content
            return '@' + m?.newauthor?.username;
          }
        }
      );

      // Replace channel mentions in the content with the corresponding channel names.
      m.content = await replaceAsync(
        m.content,
        /<#(\d+)>/g,
        async (match, g1) => {
          if (g1) {
            if (!!server) {
              // If the server exists, try to get the channel from the cache
              // let channel = server?.channels?.cache?.get(g1)
              // // If the channel isn't in the cache, fetch the channel's information using the channel ID (g1)
              // if (!channel) channel = await server?.channels?.fetch(g1)
              // Return the channel name with a "#" prefix, replacing the original mention in the content
              return '#' + m?.newchannel?.name;
            } else {
              // If the server doesn't exist, return an empty string
              return '';
            }
          }
        }
      );

      // // // Replace role mentions in the content with the corresponding role names.
      m.content = await replaceAsync(
        m.content,
        /<@&(\d+)>/g,
        async (match, g1) => {
          if (g1) {
            if (!!server) {
              // If the server exists, try to get the role from the cache
              // let role = server?.roles?.cache?.get(g1)
              // // If the role isn't in the cache, fetch the role's information using the role ID (g1)
              // if (!role) role = await server?.roles?.fetch(g1)
              // Return the role name with an "@" prefix, replacing the original mention in the content
              return '@';
            } else {
              // If the server doesn't exist, return an empty string
              return '';
            }
          }
        }
      );
      if (!m.channelName) {
        m.channelName = m?.newchannel?.name;
      }
      // Return the modified message 'm' with all the new properties assigned
      resolve(m);
    } catch (e) {
      resolve('');
    }
  });
};

//SECTION - GET MESSAGE DATA FUNCTIONS
const fetchMessageApi = async (
  serverID: string,
  offset: string,
  channelID: string | null,
  memberID: string | null,
  retries = 0
): Promise<MessageData[]> => {
  try {
    const deckID = createDeckID(serverID, channelID, memberID);
    const token = store.get('discordToken') as string;

    const headers = {
      Authorization: token,
    };

    const url = fetchURLGenerator(serverID, offset, channelID, memberID);

    try {
      const response: AxiosResponse = await axios.get(url, { headers });
      const data = response?.data;
      let messages = data?.messages?.flat();
      messages = messages.filter((m) => m.content != '');
      messages = await Promise.all(
        messages.map((m) => addMsgProps(m, serverID))
      );
      messages.reverse();

      // Add fetched messages to cache
      let messagesObj: any = {};
      messages.forEach((msg) => {
        messagesObj[msg.id] = msg;
      });
      if (decksCacheStorage.getDeck(deckID)) {
        decksCacheStorage.addMessages(deckID, messagesObj, parseInt(offset));
      } else {
        decksCacheStorage.addMessagesToNewDeck(
          deckID,
          messagesObj,
          parseInt(offset)
        );
      }
      return messages;
    } catch (error) {
      if (error.response && error?.response?.status === 429) {
        if (retries >= MAX_RETRIES) {
          throw new Error('Exceeded maximum number of retries');
        }

        let retryAfter = error.response.headers['retry-after'];

        if (!retryAfter) {
          retryAfter = 5000;
        } else {
          retryAfter = parseInt(retryAfter) + 500;
        }

        await new Promise((resolve) => setTimeout(resolve, retryAfter));
        return fetchMessageApi(
          serverID,
          offset,
          channelID,
          memberID,
          retries + 1
        );
      } else {
        // For any other errors, log the error and return an empty array
        return [];
      }
    }
  } catch (e) {
  }
};

const fetchMemberMessageApi = async (
  serverID: string,
  channelID: null,
  memberID: string,
  offset: string,
  retries = 0
): Promise<MessageData[]> => {
  try {
    const deckID = createDeckID(serverID, channelID, memberID);
    const token = store.get('discordToken') as string;

    const headers = {
      Authorization: token,
    };

    const url = fetchURLGenerator(serverID, offset, channelID, memberID);
    try {
      const response: AxiosResponse = await axios.get(url, { headers });
      const data = response?.data;
      let messages = data?.messages?.flat();
      messages = messages?.filter((m) => m.content != '');
      messages = await Promise.all(
        messages.map((m) => addMsgProps(m, serverID))
      );
      messages.reverse();

      // Add fetched messages to cache
      let messagesObj: DecksCache[typeof deckID]['messages'] = {};
      messages.forEach((msg) => {
        messagesObj[msg.id] = msg;
      });

      if (decksCacheStorage.getDeck(deckID)) {
        decksCacheStorage.addMessages(deckID, messagesObj, parseInt(offset));
      } else {
        decksCacheStorage.addMessagesToNewDeck(
          deckID,
          messagesObj,
          parseInt(offset)
        );
      }

      return messages;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        if (retries >= MAX_RETRIES) {
          throw new Error('Exceeded maximum number of retries');
        }

        let retryAfter = error.response.headers['retry-after'];

        if (!retryAfter) {
          retryAfter = 5000;
        } else {
          retryAfter = parseInt(retryAfter) + 500;
        }

        await new Promise((resolve) => setTimeout(resolve, retryAfter));
        return fetchMessageApi(
          serverID,
          offset,
          channelID,
          memberID,
          retries + 1
        );
      } else {
        // For any other errors, log the error and return an empty array
        return [];
      }
    }
  } catch (e) {
  }
};

const fetchOldMessage = async (
  serverID: string,
  offset: string,
  channelID: string | null,
  memberID: string | null,
  retries = 0
): Promise<MessageData[]> => {
  try {
    const deckID = createDeckID(serverID, channelID, memberID);
    const token = store.get('discordToken') as string;

    const headers = {
      Authorization: token,
    };

    const url = fetchURLGenerator(serverID, offset, channelID, memberID);

    try {
      const response: AxiosResponse = await axios.get(url, { headers });
      const data = response?.data;
      let messages = data?.messages?.flat();
      messages = messages?.filter((m) => m.content != '');
      messages = await Promise.all(
        messages.map((m) => addMsgProps(m, serverID))
      );
      messages.reverse();

      // Add fetched messages to cache
      let messagesObj: DecksCache[typeof deckID]['messages'] = {};
      messages.forEach((msg) => {
        messagesObj[msg.id] = msg;
      });

      if (decksCacheStorage.getDeck(deckID)) {
        decksCacheStorage.addOldMessages(deckID, messagesObj);
      }

      return messages;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        if (retries >= MAX_RETRIES) {
          throw new Error('Exceeded maximum number of retries');
        }

        let retryAfter = error.response.headers['retry-after'];

        if (!retryAfter) {
          retryAfter = 5000;
        } else {
          retryAfter = parseInt(retryAfter) + 500;
        }

        await new Promise((resolve) => setTimeout(resolve, retryAfter));
        return fetchMessageApi(
          serverID,
          offset,
          channelID,
          memberID,
          retries + 1
        );
      } else {
        // For any other errors, log the error and return an empty array
        return [];
      }
    }
  } catch (e) {
  }
};

const processMessage = async (
  message: Message,
  serverId: string | null,
  channelId: string | null,
  memberId: string | null
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const latestMessage: any = await addMsgProps(message, serverId);
      const processedMessage: MessageData = {
        id: latestMessage?.id,
        type: latestMessage?.type,
        content: latestMessage?.content,
        channel_id: latestMessage?.channelId,
        author: {
          id: latestMessage?.authorId,
          username: latestMessage?.authorName,
          global_name: null,
          display_name: null,
          avatar: latestMessage?.avatarURL,
          discriminator: latestMessage?.author?.discriminator,
          public_flags: 0,
          avatar_decoration: null,
        },
        attachments: Array.from(latestMessage?.attachments?.values()),
        embeds: latestMessage?.embeds,
        mentions: [],
        mention_roles: latestMessage?.mention_roles?.roles,
        pinned: latestMessage?.pinned,
        mention_everyone: latestMessage?.mention_everyone,
        tts: latestMessage?.tts,
        timestamp: latestMessage?.createdTimestamp,
        edited_timestamp: latestMessage?.editedTimestamp,
        flags: latestMessage?.flags.bitfield,
        components: latestMessage?.components,
        message_reference: {
          channel_id: latestMessage?.channelId,
          guild_id: latestMessage?.guildId,
          message_id: latestMessage?.id,
        },
        hit: true,
        images: latestMessage?.images,
        authorName: latestMessage?.authorName,
        authorId: latestMessage?.authorId,
        channelId: latestMessage?.channelId,
        channelName: latestMessage?.channelName,
        guildId: latestMessage?.guildId,
        roleColor: latestMessage?.roleColor,
        reply:
          {
            content: latestMessage?.reply?.content,
            authorId: latestMessage?.reply?.authorId,
            authorName: latestMessage?.reply?.authorName,
          } || null,
        reactions: [],
        createdTimestamp: latestMessage?.createdTimestamp,
        avatarURL: latestMessage?.avatarURL,
      };
      resolve(processedMessage);
    } catch (e) {
      resolve(null);
    }
  });
};

async function getLatestMessages(
  message: any,
  serverId: string | null,
  channelId: string | null,
  memberId: string | null
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const processedMessage: any = await processMessage(
        message,
        serverId,
        channelId,
        memberId
      );
      const deckIDs = decksCacheStorage.getDeckIds();
      let allPromises = [];
      for (const deckID of deckIDs) {
        allPromises.push(
          new Promise((resolve, reject) => {
            const [deckServerId, deckChannelId, deckMemberId] =
              deckID?.split('/');
            // Compare with the latestMessage's serverId, channelId, memberId
            if (
              serverId === deckServerId ||
              serverId === deckChannelId ||
              memberId === deckMemberId
            ) {
              decksCacheStorage.pushMessageToOffsetZero(
                serverId,
                channelId,
                memberId,
                processedMessage
              );
              resolve(null);
            } else {
              resolve(null);
            }
          })
        );
      }

      Promise.all(allPromises).then((done) => {
        resolve(message);
      });
    } catch (e) {
      resolve(null);
    }
  });
}

function isMatch(
  deckId: string,
  serverId: string,
  channelId: string | null,
  memberId: string | null
): any {
  return new Promise((resolve, reject) => {
    try {
      const [deckServerId, deckChannelId, deckMemberId] = deckId?.split('/'); // Assuming that deckId is in the format serverId-channelId-memberId
      if (deckServerId === serverId && deckChannelId === channelId) {
        if (deckMemberId) {
          if (deckMemberId === memberId) {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    } catch (e) {
      resolve(false);
    }
  });
}

client.on('messageCreate', async (message: Message) => {
  try {
    if (message?.author?.bot) return; // Skip bot messages to avoid notification spam
    const serverId = message?.guild?.id || null; // Get the server ID
    const channelId = message?.channel?.id || null; // Get the channel ID
    const memberId = message?.author?.id || null; // Get the member ID
    const latestMessage = await getLatestMessages(
      message,
      serverId,
      channelId,
      memberId
    );

    // Loop through the notificationsEnabledMap and check for a match
    for (const deckId in notificationsEnabledMap) {
      if (
        notificationsEnabledMap[deckId] &&
        isMatch(deckId, serverId, channelId, memberId)
      ) {
        const notification = new Notification({
          title: 'New message in your deck',
          body: latestMessage.content, // Adjust this according to your needs
        });
        notification.show();
        break; // If you want to send only one notification per message, break after the first match
      }
    }
  } catch (e) {
  }
});

/*
client.on('messageReactionAdd', async (reaction: MessageReaction, user: User) => {
    // Skip bot reactions
    try {
      
      if (user?.bot) return;

      // Get necessary IDs
      const serverId = reaction?.message?.guild?.id || null;
      const channelId = reaction?.message?.channel.id || null;
      const memberId = user?.id || null;

      // Get all the reactions of the message
      const rawReactions: any = Array.from(
        reaction?.message?.reactions?.cache?.values()
      );

      // Filter out custom emojis and transform raw reactions into the expected format
      const reactions = rawReactions
        .filter((rawReaction) => rawReaction?.emoji?.id === null) // Only include standard emojis
        .map((rawReaction) => ({
          id: rawReaction?.emoji?.toString(), // Return the visual representation of the emoji
          count: rawReaction?.count || 0, // Use the reaction count or default to 0 if it's null
        }));

      // Call updateReactions method
      await decksCacheStorage.updateReactions(
        serverId,
        channelId,
        memberId,
        reaction.message.id,
        reactions
      );

    } catch (e) {
      log.info(e);
    }
  }
);

client.on('messageReactionRemove', async (reaction: MessageReaction, user: User) => {
    try {
      // Skip bot reactions
      if (user?.bot) return;

      // Get necessary IDs
      const serverId = reaction?.message?.guild?.id || null;
      const channelId = reaction?.message?.channel?.id || null;
      const memberId = user?.id || null;

      // Create deckID
      const deckID = createDeckID(serverId, channelId, memberId);

      // Get all the reactions of the message
      const rawReactions: any = Array.from(
        reaction?.message?.reactions?.cache?.values()
      );

      // Transform raw reactions into the expected format
      const reactions = rawReactions.map((rawReaction) => ({
        id: rawReaction?.emoji?.id || rawReaction?.emoji?.name, // Use the emoji's ID or name as the ID
        count: rawReaction?.count || 0, // Use the reaction count or default to 0 if it's null
      }));

      // Call updateReactions method
      await decksCacheStorage.updateReactions(
        serverId,
        channelId,
        memberId,
        reaction.message.id,
        reactions
      );
    } catch (e) {
      log.info(e);
    }
  }
);

client.on('messageDelete', async (message: Message) => {
  // Get the message ID
  try {
    const messageId = message?.id;

    // Call the method to delete the message from all decks
    decksCacheStorage.deleteMessageFromAllDecks(messageId);
  } catch (e) {
    log.info(e);
  }
});
*/

//SECTION ========= DATA CONTROLLERS =========

export const getServerDataController = async (): Promise<ServerDataCache[]> => {
  try {
    const servers = serverDataCacheStorage.getServers();
    const uniqueServers: ServerDataCache[] = [];

    // Using a Set to avoid duplicates
    const serverIdsSet = new Set<string>();

    for (const server of servers) {
      if (!serverIdsSet.has(server?.serverId)) {
        serverIdsSet.add(server?.serverId);
        uniqueServers.push(server);
      }
    }

    return uniqueServers;
  } catch (e) {
    log.info(e);
  }
};

export async function searchServerMembers(
  serverId: string,
  qry: string
): Promise<ServerDataCache['members']> {
  return new Promise(async (resolve, reject) => {
    try {
      log.info('searchServerMembers');
      log.info('serverID', serverId, '  qry= ', qry);
      serverId = serverId?.toString();
      qry = qry?.toString();

      let server = client?.guilds?.cache?.get(serverId);
      if (!server) server = await client?.guilds?.fetch(serverId);
      log.info('serverID', serverId, '  qry= ', qry);
      // Fetch members from the server
      let membersFetched;
      if (qry !== '' && qry !== 'null') {
        membersFetched = await server?.members?.fetch({
          query: qry,
          limit: 100,
        });
      } else {
        membersFetched = await server?.members?.fetch({ limit: 1000 });
      }

      // Process fetched members into the desired format
      const membersProcessed: ServerDataCache['members'] = membersFetched?.map(
        (member) => ({
          memberId: member?.id,
          memberName: member?.displayName,
        })
      );
      log.info('membersProcessed');
      log.info(membersProcessed);
      // Update the cache
      const serverCache = serverDataCacheStorage.getServer(serverId);
      if (serverCache) {
        serverCache.members = membersProcessed;
        serverDataCacheStorage.setServer(serverId, serverCache);
        resolve(membersProcessed);
      } else {
        // If the server does not exist in the cache, create a new server entry
        serverDataCacheStorage.setServer(serverId, {
          serverId,
          serverName: server?.name,
          channels: [], // Populate channels if necessary
          members: membersProcessed,
        });
        resolve(membersProcessed);
      }

      // resolve(membersProcessed);
    } catch (e) {
      log.info(e);
      resolve(null);
    }
  });
}

export const deleteDeck = (
  serverID: string,
  channelID: string | null,
  memberID: string
): void => {
  try {
    const deckID = createDeckID(serverID, channelID, memberID);
    decksCacheStorage.deleteDeck(deckID);
  } catch (e) {
    log.info(e);
  }
};

export const getMessagesDataController = async (
  serverID: string,
  channelID: string | null,
  memberID: string,
  offset: string
): Promise<MessageData[]> => {
  return new Promise(async (resolve, reject) => {
    // log.info("getMessagesDataController")
    // log.info("offset",offset)
    try {
      const deckID = createDeckID(serverID, channelID, memberID);
      // log.info("deckID = ",deckID)
      // log.info("alldecks = ",decksCacheStorage.getDecks())
      let deck = decksCacheStorage.getDeck(deckID);
      // log.info("deck = ",deck)
      let lastOffset = decksCacheStorage.getLastOffset(deckID);
      log.info('lastOffset = ', lastOffset);
      // create new deck if it doesn't exist
      if (!deck) {
        decksCacheStorage.createNewDeck(deckID);
        deck = decksCacheStorage.getDeck(deckID);
        // log.info("deck2 = ",deck)
      }

      if (
        parseInt(offset) === 0 &&
        decksCacheStorage.getNumberofMessagesInOffsetZero(deckID) > 0
      ) {
        //   log.info("decksCacheStorage = ",decksCacheStorage.getMessages(deckID, parseInt(offset)))
        // log.info("beforeAdd 0=== ",decksCacheStorage.getMessages(deckID, parseInt(offset)))
        resolve(decksCacheStorage.getMessages(deckID, parseInt(offset)));
      }

      if (deck && lastOffset === parseInt(offset)) {
        // log.info("deckID xx== ",deckID)
        // log.info("getDeck", decksCacheStorage.getDeck(deckID))

        const messages = decksCacheStorage.getMessages(
          deckID,
          parseInt(offset)
        );
        // log.info("messages = ",messages)
        // log.info("beforeAdd 1=== ",messages)
        let promiseArray = [];
        let promiseArray2 = [];
        messages.map((item) => {
          // promiseArray.push(getUserAvatarURLNew(item.author.id, item));
          promiseArray.push(getReplyMessage(item?.author?.id, item,messages));
          
        });

        Promise.all(promiseArray).then((done1) => {
          log.info('done1===', done1);
          // messages.map((item, index) => {
          //     item.reply = done1[index];
           
          //   });
          resolve(done1);
      }).catch((error) => {
          // log.info("Erroror===",error)
          resolve(messages);
        });
        // Promise.all(promiseArray)
        //   .then((done) => {
        //     log.info('done===', done);
        //     messages.map((item, index) => {
        //       item.avatarURL = done[index];
           
        //     });
        //     Promise.all(promiseArray2).then((done1) => {
        //         log.info('done1===', done1);
        //         messages.map((item, index) => {
        //             item.reply = done1[index];
                 
        //           });
        //         resolve(messages);
        //     }).catch((error) => {
        //         // log.info("Erroror===",error)
        //         resolve(messages);
        //       });
        //     // log.info("done1===",messages)
          
        //   })
        //   .catch((error) => {
        //     // log.info("Erroror===",error)
        //     resolve(messages);
        //   });
      } else {
        decksCacheStorage.updateLastOffset(deckID, parseInt(offset));
        store.set(`loadingState.${deckID}`, true);
        const messagesArray = await fetchMessageApi(
          serverID,
          offset,
          channelID,
          memberID
        );
        // log.info("messagesArray = ",messagesArray)
        // Convert array to object with message ids as keys
        const messagesObject: DecksCache[typeof deckID]['messages'] =
          messagesArray.reduce((acc, message) => {
            acc[message.id] = message;
            return acc;
          }, {});
        // log.info('beforeAdd 3=== ', messagesObject);
        // Add the new messages to the cache
        decksCacheStorage.addMessages(deckID, messagesObject, parseInt(offset));

        store.set(`loadingState.${deckID}`, false);
        log.info(
          ' decksCacheStorage.getMessages === ',
          decksCacheStorage.getMessages(deckID, parseInt(offset))
        );
        resolve(decksCacheStorage.getMessages(deckID, parseInt(offset)));
      }
    } catch (e) {
      log.info(e);
      resolve(null);
    }
  });
};

export const createMessageWorkerThread = async (message: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (message?.author?.bot) resolve(null); // Skip bot messages to avoid notification spam
      const serverId = message?.guildId || null; // Get the server ID
      const channelId = message?.channelId || null; // Get the channel ID
      let memberId = message?.authorId || null; // Get the member ID
      if (!memberId) {
        memberId = message?.reply?.authorId;
      }
      const latestMessage = await getLatestMessages(
        message,
        serverId,
        channelId,
        memberId
      );

      // Loop through the notificationsEnabledMap and check for a match
      // log.info("message = ",message)
      let deckId1 = `${latestMessage.guildId}/${latestMessage.channelId}/null`;
      let deckId2 = `${latestMessage.guildId}/${latestMessage.channelId}/${latestMessage.authorId}`;

      if (notificationsEnabledMap[deckId1]) {
        // const [deckServerId, deckChannelId, deckMemberId] = deckId?.split('/');
        // log.info("latestMessage.guildId",latestMessage.guildId,"latestMessage.channel_id=",latestMessage.channel_id,"deckServerId",deckServerId, "deckChannelId",deckChannelId, "deckMemberId",deckMemberId,"content====",latestMessage.content)
        // if(latestMessage.guildId==deckServerId&&latestMessage.channelId ==deckChannelId){
        const notification = new Notification({
          title: 'New message in your deck',
          body: latestMessage.content, // Adjust this according to your needs
        });
        notification.show();
        // }
        // let ismatch =await isMatch(deckId, serverId, channelId, memberId)
        // log.info("ismatch=",ismatch)
        // if(ismatch){
        // const notification = new Notification({
        //     title: 'New message in your deck',
        //     body: latestMessage.content,  // Adjust this according to your needs
        // });
        // notification.show();

        resolve(null); // If you want to send only one notification per message, break after the first match
      } else if (notificationsEnabledMap[deckId2]) {
        const notification = new Notification({
          title: 'New message in your deck',
          body: latestMessage.content, // Adjust this according to your needs
        });
        notification.show();
      } else {
        resolve(null);
      }
      // for (const deckId in notificationsEnabledMap) {

      //   if (notificationsEnabledMap[deckId] ) {
      //     const [deckServerId, deckChannelId, deckMemberId] = deckId?.split('/');
      //     log.info("latestMessage.guildId",latestMessage.guildId,"latestMessage.channel_id=",latestMessage.channel_id,"deckServerId",deckServerId, "deckChannelId",deckChannelId, "deckMemberId",deckMemberId,"content====",latestMessage.content)
      //     if(latestMessage.guildId==deckServerId&&latestMessage.channel_id ==deckChannelId){
      //          const notification = new Notification({
      //         title: 'New message in your deck',
      //         body: latestMessage.content,  // Adjust this according to your needs
      //     });
      //     notification.show();
      //     }
      //     // let ismatch =await isMatch(deckId, serverId, channelId, memberId)
      //     // log.info("ismatch=",ismatch)
      //     // if(ismatch){
      //     // const notification = new Notification({
      //     //     title: 'New message in your deck',
      //     //     body: latestMessage.content,  // Adjust this according to your needs
      //     // });
      //     // notification.show();

      //     resolve(null); // If you want to send only one notification per message, break after the first match
      //   }else{
      //     resolve(null);
      // }

      // }
    } catch (e) {
      resolve(null);
    }
  });
};

export const getMemberMessagesDataController = async (
  serverID: string,
  channelID: null,
  memberID: string,
  offset: string
): Promise<MessageData[]> => {
  try {
    const deckID = createDeckID(serverID, channelID, memberID);
    let deck = decksCacheStorage.getDeck(deckID);
    let lastOffset = decksCacheStorage.getLastOffset(deckID);

    // create new deck if it doesn't exist
    if (!deck) {
      decksCacheStorage.createNewDeck(deckID);
      deck = decksCacheStorage.getDeck(deckID);
    }

    if (
      parseInt(offset) === 0 &&
      decksCacheStorage.getNumberofMessagesInOffsetZero(deckID) > 0
    ) {
      return decksCacheStorage.getMessagesIfChannelNull(serverID, memberID);
    }

    if (deck && lastOffset === parseInt(offset)) {
      const messages = decksCacheStorage.getMessagesIfChannelNull(
        serverID,
        memberID
      );
      return messages;
    } else {
      decksCacheStorage.updateLastOffset(deckID, parseInt(offset));
      store.set(`loadingState.${deckID}`, true);
      const messagesArray = await fetchMemberMessageApi(
        serverID,
        channelID,
        memberID,
        offset
      );

      // Convert array to object with message ids as keys
      const messagesObject: DecksCache[typeof deckID]['messages'] =
        messagesArray.reduce((acc, message) => {
          acc[message.id] = message;
          return acc;
        }, {});

      // Add the new messages to the cache
      decksCacheStorage.addMessagesWhenChannelNull(
        serverID,
        memberID,
        messagesObject
      );

      store.set(`loadingState.${deckID}`, false);
      return decksCacheStorage.getMessagesIfChannelNull(serverID, memberID);
    }
  } catch (e) {
  }
};

export const loadMore = async (
  serverID: string,
  channelID: string | null,
  memberID: string,
  offset: string
): Promise<MessageData[]> => {
  try {
    const deckID = createDeckID(serverID, channelID, memberID);
    let deck = decksCacheStorage.getDeck(deckID);

    if (!deck) {
      decksCacheStorage.createNewDeck(deckID);
      deck = decksCacheStorage.getDeck(deckID);
    }

    if (deck) {
      store.set(`loadingState.${deckID}`, true);
      const oldMessages = await fetchOldMessage(
        serverID,
        offset,
        channelID,
        memberID
      );
      const messagesObject: DecksCache[typeof deckID]['messages'] =
        oldMessages.reduce((acc, message) => {
          acc[message.id] = message;
          return acc;
        }, {});

      decksCacheStorage.addOldMessages(deckID, messagesObject);
      store.set(`loadingState.${deckID}`, false);
      return decksCacheStorage.getMessages(deckID, parseInt(offset));
    } else {
      return [];
    }
  } catch (e) {
  }
};

export function getMemberNameById(memberId: string): string | undefined {
  try {
    return serverDataCacheStorage.getMemberName(memberId);
  } catch (e) {
  }
}

// ==========================================

client.on('messageDelete', async (message) => {
  try {
    if (message.author) {
      // Check if the author exists
      const serverId = message.guild?.id ?? null;
      const channelId = message.channel.id;
      const memberId = message.author.id;
      const deckID = createDeckID(serverId, channelId, memberId);

      // Remove the message from the deck cache
      decksCacheStorage.deleteMessage(deckID, message.id);
    }
  } catch (e) {
  }
});

// ==========================================
