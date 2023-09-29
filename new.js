require('events');
const fs = require('fs');
const { MessageChannel } = require('node:worker_threads');
const log = require('electron-log');
log.transports.file.level = 'info';
log.transports.file.file ="worker.log";
const Discord = require('discord.js-selfbot-v13');
const client = new Discord.Client({ checkUpdate: false });
const { workerData, parentPort, isMainThread } = require('worker_threads');

let logFilePath = 'C:\\Users\\Public\\simplifylog1.txt';
let search_member ="C:\\Users\\Public\\search_member.json"
fs.appendFileSync(logFilePath, 'currunt dir = ' + __dirname + '\n');

client.on('ready', async () => {
  console.log(`${client.user.username} is ready!`);
  fs.appendFileSync(logFilePath, ' is ready');
});

parentPort.on('message',async (parms) => {
  // log.info("parentPort====")
  // log.info(parms)
  if (parms[0]=="search_members") {
    //search members
    const members =await searchServerMembers(parms[1],parms[2])
    fs.writeFileSync(search_member, JSON.stringify({members:members}));
   
  } else if (parms[0]=="send-message") {
    const client1 = new Discord.Client({ checkUpdate: false });
    client1.login(parms[3]);
    client1.on('ready', async () => {
    
      fs.appendFileSync(logFilePath, ' is ready to send message');
      const channel = client1.channels.cache.get(parms[1]);
      channel.send(parms[2]);
    });
   
    // log.info(channel)

  } else if(parms[0]=="send-auth-token"){
    client.login(parms[1]);
  }else if(parms[0]=="reply-message"){
    // channelId, messageId, messageContent
    // client.login(parms[1]);
   let messageFuncReply =  await sendMessageReply(parms[1],parms[2],parms[3])
   fs.appendFileSync(logFilePath, "\r\n"+messageFuncReply.toString()+"\r\n");
  }
});

client.on('messageCreate', async (message) => {
 if(message){
  // fs.appendFileSync(logFilePath, "\r\n"+JSON.stringify(message)+"\r\n");
  // fs.appendFileSync(logFilePath, "\r\n message?.author=="+message?.author+" \r\n");
  let newObj = JSON.stringify(message?.author)
  let newChannelObj = JSON.stringify(message?.channel)
  // fs.appendFileSync(logFilePath, "\r\n message?.author.username=="+newObj+" \r\n");
  message.newauthor=JSON.parse(newObj)
  message.newchannel=JSON.parse(newChannelObj)
  if( message.type== "REPLY"){
    let channel = client?.channels?.cache?.get(message?.reference?.channelId)
    let messageNew = await channel?.messages?.fetch(message?.reference?.messageId)
    //  fs.appendFileSync(logFilePath, "\r\n replyMessage"+messageNew+" \r\n");
    let pasedNewMessage = await getMessage(message?.guildId,message?.channelId,message?.id)
    let strigifyMessage = JSON.stringify(pasedNewMessage)
    message.replyMessageObj =JSON.parse(strigifyMessage)
  }
    message.newavatarURL = await getUserAvatarURL(message?.author?.id)
  try {
    parentPort.postMessage(JSON.stringify(message));
  } catch (e) {
    fs.appendFileSync(logFilePath, e.toString());
  }
}
});

client.on('messageReactionAdd', async (reaction, user) => {
    // Skip bot reactions
    fs.appendFileSync(logFilePath, 'messageReactionAdd\r\n');

    try {
      if (user?.bot) return;

      // Get necessary IDs
      const serverId = reaction?.message?.guild?.id || null;
      const channelId = reaction?.message?.channel.id || null;
      const memberId = user?.id || null;

      // Get all the reactions of the message
      let rawReactions= Array.from(
        reaction?.message?.reactions?.cache?.values()
      );

      // Filter out custom emojis and transform raw reactions into the expected format
      let reactions = rawReactions
        .filter((rawReaction) => rawReaction?.emoji?.id === null) // Only include standard emojis
        .map((rawReaction) => ({
          id: rawReaction?.emoji?.toString(), // Return the visual representation of the emoji
          count: rawReaction?.count || 0, // Use the reaction count or default to 0 if it's null
        }));

      parentPort.postMessage(
   JSON.stringify(
    { 
      type_message :"message-reaction",
      serverId: serverId,
      channelId:  channelId,
      memberId:   memberId,
      message_id:    reaction.message.id,
      reactions:  reactions
    }
   )
      );
    } catch (e) {
      log.info(e);
    }
  }
);

client.on('messageDelete', async (message) => {
  // Get the message ID
  fs.appendFileSync(logFilePath, 'messageDelete\r\n');
  // fs.appendFileSync(logFilePath, JSON.stringify(message));
  try {
    const messageId = message?.id;
    fs.appendFileSync(logFilePath, 'messageId ='+messageId+'\r\n');
    // Call the method to delete the message from all decks
    // decksCacheStorage.deleteMessageFromAllDecks(messageId);
    parentPort.postMessage(
      JSON.stringify(
        {
          type_message: "message-deleted",
          messageId:messageId
        }
      )
    )
  } catch (e) {
    log.info(e);
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
  return new Promise(async (resolve, reject) => {
    userId = userId?.toString();
    let user = client?.users?.cache?.get(userId);
    try {
      if (!user) user = await client?.users?.fetch(userId);
      let url = user?.avatarURL();
      if (!url) url = user?.defaultAvatarURL;
      resolve(url);
    } catch (e) {
      log.info(e);
      resolve(null);
    }
  });
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

async function searchServerMembers(serverId, qry) {
  fs.appendFileSync(logFilePath, 'searchServerMembers\r\n');
  fs.appendFileSync(logFilePath, serverId+' '+qry+'  searchServerMembers\r\n');
  return new Promise(async (resolve,reject)=>{
     try{
        //  log.info("searchServerMembers")
        //  log.info("serverID",serverId,'  qry= ',qry)
         serverId = serverId?.toString();
     qry = qry?.toString();
 
     let server = client?.guilds?.cache?.get(serverId);
     fs.appendFileSync(logFilePath, server.toString());
 
     if (!server) server = await client?.guilds?.fetch(serverId);
    //  log.info("serverID",serverId,'  qry= ',qry)
     // Fetch members from the server
     let membersFetched;
     if (qry !== "" && qry !== "null") {
         membersFetched = await server?.members?.fetch({ query: qry, limit: 100 });
     } else {
         membersFetched = await server?.members?.fetch({ limit: 1000 });
     }
     fs.appendFileSync(logFilePath, '\r\n membersFetched ====');
     fs.appendFileSync(logFilePath, JSON.stringify(membersFetched));// Process fetched members into the desired format
     let membersProcessed= membersFetched?.map(member => ({
         memberId: member?.id,
         memberName: member?.displayName,
     }));
//  log.info("membersProcessed")
//  log.info(membersProcessed)
     // Update the cache
    //  const serverCache = serverDataCacheStorage.getServer(serverId);
    //  if (serverCache) {
    //      serverCache.members = membersProcessed;
    //      serverDataCacheStorage.setServer(serverId, serverCache);
    //      resolve(membersProcessed);
    //  } else {
    //      // If the server does not exist in the cache, create a new server entry
    //      serverDataCacheStorage.setServer(serverId, {
    //          serverId,
    //          serverName: server?.name,
    //          channels: [],  // Populate channels if necessary
    //          members: membersProcessed,
    //      });
    //      resolve(membersProcessed);
    //  }
    fs.appendFileSync(logFilePath, '\r\n membersFetched ====');
    fs.appendFileSync(logFilePath, JSON.stringify(membersProcessed));
 
     resolve(membersProcessed);
 }catch(e){
    // log.info(e)
    fs.appendFileSync(logFilePath, e.toString());
 
    resolve(null)
 }
 })
}

async function sendMessageReply(channelId, messageId, messageContent) {

return new Promise(async(resolve,rejects)=>{

try{  if (!channelId) {
    //   throw new Error("Channel ID is required");
    resolve(null)
    }
  
    const channel = client?.channels?.cache?.get(channelId);
    if (!channel || channel.type !== 'GUILD_TEXT') {
    //   throw new Error("Channel not found or not a text channel");
      resolve(null)
    }
  
    const message = await channel?.messages?.fetch(messageId);
    if (!message) {
    //   throw new Error("Message not found");
      resolve(null)
    }
  
    resolve(await channel.send({
      content: messageContent,
      reply: {
        messageReference: message,
        failIfNotExists: false,
      },
    }));
}catch(e){
    console.log(e)
}
})  
}
 