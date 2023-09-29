require('events');

const fs = require('fs');
// fs.appendFileSync("C:\\Users\\sourabh\\Documents\\demo\\simplifids\\logs\\log.txt","currunt dir"+__dirname+"\n")

const { MessageChannel } = require('node:worker_threads');
// const {app} = require('electron');
const Store = require('electron-store');
const log = require('electron-log');
const Discord = require('discord.js-selfbot-v13');
const store = new Store();
const client = new Discord.Client({ checkUpdate: false });
client.login(
  ''
);
const discordToken = store.get('discordToken');
let logFilePath = 'C:\\Users\\Public\\simplifylog.txt';
fs.appendFileSync(logFilePath, 'currunt dir = ' + __dirname + '\n');
log.transports.file.resolvePath = () => 'C:\\Users\\Public\\log.log';
console.log('worker thread initiated');

const { workerData, parentPort, isMainThread } = require('worker_threads');
const { cli } = require('webpack');
// fs.appendFileSync("C:\\Users\\sourabh\\Documents\\demo\\simplifids\\logs\\log.txt",discordToken)

client.on('ready', async () => {
  console.log(`${client.user.username} is ready!`);
  // fs.appendFileSync(logFilePath, ' is ready');
  // const channel = client.channels.cache.get('1114227827852714144');
  // console.log(channel);
  // //   if (channel.isText() {
  // channel.send('message');
  //   }
  // console.log("USer",client.users.cache.filter((user)=>{if(user.id=='1114129452381786133'){return true}else{return false}}))
// let channel = await client?.channels?.cache?.get("1008571086411145308")
// let messageNew = await channel?.messages?.fetch("1119684859103825991")
// console.log("messageNew = ",JSON.stringify(messageNew))
// let replyMessage = await getMessage("947068400407019531", "1114227827852714144", "1119860545881907260")
// console.log("replyMessage = ",replyMessage)
    // } catch (e) {
});



async function getMessage(serverId, channelId, msgId) {
  try{
      if(channelId&&serverId&&msgId){
  channelId = channelId?.toString()
  let channel = client?.channels?.cache?.get(channelId) ;

  if(!channel) return null

  let replyMsg;
  try {
      replyMsg = await channel?.messages?.fetch(msgId)
  } catch (e) {
      console.error(`Could not fetch the message with id ${msgId}. Error: ${e?.message}`);
      return null; // You might want to return a specific structure or error code here.
  }
  
  let newReplyMsg = {
      authorId: replyMsg?.author ? replyMsg?.author?.id : null,
      authorName: replyMsg?.author ? replyMsg?.author?.username : null,
      content: replyMsg?.content
  };
  
  let server = !!replyMsg?.guild ? replyMsg?.guild : client?.guilds?.cache?.get(serverId)

  if(!server) return null

  replyMsg.content = await replaceAsync(replyMsg?.content, /<@(\d+)>/g, async (match, g1) => {
      let user = client?.users?.cache?.get(g1)
      if (!user) user = await client?.users?.fetch(g1)
      return "@" + user?.username
  });
  replyMsg.content = await replaceAsync(replyMsg?.content, /<#(\d+)>/g, async (match, g1) => {
      if (!!server) {
          let channel = server?.channels?.cache?.get(g1)
          if (!channel) channel = await server?.channels?.fetch(g1)
          return "#" + channel?.name
      } else {
          return ""
      }
  });
  replyMsg.content = await replaceAsync(replyMsg?.content, /<@&(\d+)>/g, async (match, g1) => {
      if (!!server) {
          let role = server?.roles?.cache?.get(g1)
          if (!role) role = await server?.roles?.fetch(g1)
          return "@" + role?.name
      } else {
          return ""
      }
  });
  return {
      content: newReplyMsg?.content,
      authorId: newReplyMsg?.authorId,
      authorName: newReplyMsg?.authorName,
  }
}
}catch(e){
 log.info(e)
}
}

let f = false;
client.on('messageCreate', async (message) => {
  try {
    if (!f) {
      let processedMessage =message
      // console.log(message)
      // f = true;
    //   // ******************start***************************
    //   // await new Promise((resolve,reject)=>{
    //   // if (message?.author?.bot) resolve(null); // Skip bot messages to avoid notification spam
    //   let serverId = message?.guildId || null;
    //   let channelId = message?.channelId || null;
    //   let memberId = message?.authorId || null;
    //   let processedMessage = {
    //     serverId: message?.guildId || null,
    //     channelId: message?.channelId || null,
    //     memberId: message?.authorId || null,
    //     id: message?.id,
    //     type: message?.type,
    //     content: message?.content,
    //     channel_id: message?.channelId,
    //     author: {
    //       id: message?.authorId,
    //       username: message?.authorName,
    //       global_name: null,
    //       display_name: null,
    //       avatar: message?.avatarURL,
    //       discriminator: message?.author?.discriminator,
    //       public_flags: 0,
    //       avatar_decoration: null,
    //     },
    //     attachments: Array.from(message?.attachments?.values()),
    //     embeds: message?.embeds,
    //     mentions: [],
    //     mention_roles: message?.mention_roles?.roles,
    //     pinned: message?.pinned,
    //     mention_everyone: message?.mention_everyone,
    //     tts: message?.tts,
    //     timestamp: message?.createdTimestamp,
    //     edited_timestamp: message?.editedTimestamp,
    //     flags: message?.flags.bitfield,
    //     components: message?.components,
    //     message_reference: {
    //       channel_id: message?.channelId,
    //       guild_id: message?.guildId,
    //       message_id: message?.id,
    //     },
    //     hit: true,
    //     images: message?.images,
    //     authorName: message?.authorName,
    //     authorId: message?.authorId,
    //     channelId: message?.channelId,
    //     channelName: message?.channelName,
    //     guildId: message?.guildId,
    //     roleColor: message?.roleColor,
    //     reply:
    //       {
    //         content: message?.reply?.content,
    //         authorId: message?.reply?.authorId,
    //         authorName: message?.reply?.authorName,
    //       } || null,
    //     reactions: [],
    //     createdTimestamp: message?.createdTimestamp,
    //     avatarURL: message?.avatarURL,
    //   };

    //   // })

    //   // Filter out attachments that have the content type of image and map their URLs into an 'images' array.
    //   if (processedMessage?.attachments.length > 0) {
    //     processedMessage.images = processedMessage?.attachments
    //       ?.filter(
    //         (a) =>
    //           (a.contentType != null && a?.contentType?.startsWith('image')) ||
    //           (a.content_type != null && a.content_type.startsWith('image'))
    //       )
    //       .map((a) => a.url);
    //   } else {
    //     processedMessage.images = [];
    //   }

    //   // If the author of the message has a nickname, assign it to authorName. If not, assign the author's username to authorName.
    //   if (processedMessage?.author) {
    //     processedMessage.authorName = processedMessage?.author?.nickname;
    //     if (!processedMessage.authorName)
    //       processedMessage.authorName = processedMessage?.author?.username;
    //   }

    //   // If the author exists, assign the author's id to authorId.
    //   if (!!processedMessage.author) {
    //     if (processedMessage.authorId) {
    //       processedMessage.authorId = processedMessage.authorId;
    //     } else {
    //       processedMessage.authorId = processedMessage.author.id;
    //     }
    //   } else if (processedMessage.authorId) {
    //     processedMessage.authorId = processedMessage.authorId;
    //   }

    //   // If the channel is not directly associated with the message, get it from the client's cache or fetch it from the server.
    //   if (!!processedMessage.channel) {
    //     if (processedMessage?.channelId) {
    //       processedMessage.channelId = processedMessage?.channelId;
    //     } else {
    //       processedMessage.channelId = processedMessage?.channel.id;
    //     }

    //     processedMessage.channelName = processedMessage?.channel?.name;
    //   } else if (processedMessage?.channelId) {
    //     processedMessage.channelId = processedMessage?.channelId;
    //   } else {
    //     processedMessage.channelId = processedMessage?.channel_id;
    //     let channel = client?.channels?.cache?.get(processedMessage.channel_id);
    //     if (!channel)
    //       channel = await client?.channels?.fetch(processedMessage.channel_id);
    //     if (channel) {
    //       // Check if it's GuildChannel
    //       processedMessage.channelName = channel?.name;
    //       let server = !!processedMessage.guildId
    //         ? processedMessage.guildId
    //         : client?.guilds?.cache?.get(serverId);
    //       let member;
    //       if (!!server) {
    //         member = server?.members?.cache?.get(processedMessage.authorId);
    //         if (!member)
    //           member = await server?.members?.fetch(processedMessage?.authorId);
    //       }
    //     }
    //   }

    //   // Get the server (guild) information. If the server information doesn't exist in the message, fetch it from the client's cache using the serverId.
    //   let server = !!processedMessage.guild
    //     ? processedMessage.guild
    //     : client?.guilds?.cache?.get(serverId);
    //   processedMessage.guildId = server?.id;

    //   // If the member who sent the message exists, get their role color. If not, try to fetch it from the server. If that's also not possible, set the role color to "null".
    //   processedMessage.roleColor = !!processedMessage.member
    //     ? processedMessage?.member?.displayHexColor
    //     : 'null';
    //   if (processedMessage.roleColor == 'null' && !!server) {
    //     let member = server?.members?.cache?.get(processedMessage.authorId);
    //     try {
    //       if (!member)
    //         member = await server?.members?.fetch(processedMessage?.authorId);
    //       processedMessage.roleColor = member?.displayHexColor;
    //     } catch (e) {}
    //   }

    //   // If the message is a reply to another message, fetch the original message that this one is replying to.
    //   let replyMsg = processedMessage.message_reference
    //     ? processedMessage.message_reference
    //     : processedMessage.reference;
    //   if (replyMsg != undefined) {
    //     let fetchedMsg = await getMessage(
    //       serverId,
    //       replyMsg.channel_id || replyMsg.channelId,
    //       replyMsg.message_id || replyMsg.messageId
    //     );
    //     if (fetchedMsg === null) {
    //       // Handle the error, you might want to set m.reply to a default value or just skip this message.
    //     } else {
    //       processedMessage.reply = fetchedMsg;
    //     }
    //   }

    //   // If the createdTimestamp is not set, try to set it using the timestamp. If the createdTimestamp is a number, convert it to a string.
    //   if (!processedMessage.createdTimestamp && processedMessage.timestamp)
	  // processedMessage.createdTimestamp = new Date(processedMessage?.timestamp).toString();
    //   if (typeof processedMessage.createdTimestamp == 'number')
	  // processedMessage.createdTimestamp = new Date(processedMessage?.createdTimestamp).toString();
    //  console.log('check9');

    //   // If the avatarURL is not set, get the URL of the user's avatar.
    //   if (!processedMessage.avatarURL) processedMessage.avatarURL = await getUserAvatarURL(processedMessage.authorId);
    //  console.log('check10');


  // Replace user mentions in the content with the corresponding usernames.
  processedMessage.content = await replaceAsync(processedMessage?.content, /<@(\d+)>/g, async (match, g1) => {

	if(g1){
	let user = client?.users?.cache?.get(g1)
	// If the user isn't in the cache, fetch the user's information using the user ID (g1)
	if (!user) user = await client?.users?.fetch(g1)
	// Return the username with an "@" prefix, replacing the original mention in the content
	return "@" + user?.username
	}
});
log.info("check11")

// Replace channel mentions in the content with the corresponding channel names.
processedMessage.content = await replaceAsync(processedMessage.content, /<#(\d+)>/g, async (match, g1) => {
	if(g1){
	if (!!server) {
		// If the server exists, try to get the channel from the cache
		let channel = server?.channels?.cache?.get(g1)
		// If the channel isn't in the cache, fetch the channel's information using the channel ID (g1)
		if (!channel) channel = await server?.channels?.fetch(g1)
		// Return the channel name with a "#" prefix, replacing the original mention in the content
		return "#" + channel?.name
	} else {
		// If the server doesn't exist, return an empty string
    return ""
	}
}
});
log.info("check12")

// Replace role mentions in the content with the corresponding role names.
processedMessage.content = await replaceAsync(processedMessage.content, /<@&(\d+)>/g, async (match, g1) => {
	if(g1){
	if (!!server) {
		// If the server exists, try to get the role from the cache
		let role = server?.roles?.cache?.get(g1)
		// If the role isn't in the cache, fetch the role's information using the role ID (g1)
		if (!role) role = await server?.roles?.fetch(g1)
		// Return the role name with an "@" prefix, replacing the original mention in the content
		return "@" + role?.name
	} else {
		// If the server doesn't exist, return an empty string
    return ""
	}
}
	})
    }
  } catch (e) {
    console.log(e);
  }
});

async function getMessage(serverId, channelId, msgId) {
  return new Promise(async (resolve, reject) => {
    try {
      if (channelId && serverId && msgId) {
        channelId = channelId?.toString();
        let channel = client?.channels?.cache?.get(channelId);

        if (!channel) resolve(null);

        let replyMsg;
        try {
          replyMsg = await channel?.messages?.fetch(msgId);
        } catch (e) {
          console.error(
            `Could not fetch the message with id ${msgId}. Error: ${e?.message}`
          );
          resolve(null); // You might want to return a specific structure or error code here.
        }

        let newReplyMsg = {
          authorId: replyMsg?.author ? replyMsg?.author?.id : null,
          authorName: replyMsg?.author ? replyMsg?.author?.username : null,
          content: replyMsg?.content,
        };

        let server = !!replyMsg?.guild
          ? replyMsg?.guild
          : client?.guilds?.cache?.get(serverId);

        if (!server) resolve(null);

        replyMsg.content = await replaceAsync(
          replyMsg?.content,
          /<@(\d+)>/g,
          async (match, g1) => {
            let user = client?.users?.cache?.get(g1);
            if (!user) user = await client?.users?.fetch(g1);
            resolve('@' + user?.username);
          }
        );
        replyMsg.content = await replaceAsync(
          replyMsg?.content,
          /<#(\d+)>/g,
          async (match, g1) => {
            if (!!server) {
              let channel = server?.channels?.cache?.get(g1);
              if (!channel) channel = await server?.channels?.fetch(g1);
              resolve('#' + channel?.name);
            } else {
              resolve('');
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
              resolve('@' + role?.name);
            } else {
              resolve('');
            }
          }
        );
        resolve({
          content: newReplyMsg?.content,
          authorId: newReplyMsg?.authorId,
          authorName: newReplyMsg?.authorName,
        });
      }
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}


async function getUserAvatarURL(userId) {
    return new Promise(async(resolve,reject)=>{
    userId = userId?.toString();
    let user = client?.users?.cache?.get(userId);
    try {
        if (!user) user = await client?.users?.fetch(userId);
        let url = user?.avatarURL();
        if (!url) url = user?.defaultAvatarURL
        resolve(url);
    } catch (e) { 
       log.info(e)
	   resolve(null);
    }
})
}


async function replaceAsync(str, regex, asyncFn) {
	const promises = []; 
	str.replace(regex, (match, ...args) => {
		const promise = asyncFn(match, ...args);
		promises.push(promise);
	});
	const data = await Promise.all(promises);
	return str.replace(regex, () => data.shift());
  }

  