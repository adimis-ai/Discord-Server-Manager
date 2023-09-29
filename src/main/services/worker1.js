require('events');
const fs = require('fs');
const { MessageChannel } = require('node:worker_threads');
const log = require('electron-log');
log.transports.file.level = 'info';
log.transports.file.file ="worker.log";
const Discord = require('discord.js-selfbot-v13');
const client = new Discord.Client({ checkUpdate: false });
const { workerData, parentPort, isMainThread } = require('worker_threads');
const path = require('path');

let logfile = 'Worker-Log.txt';
//log.info("Darwin1 ==", path.join(workerData.workerData,'search_member.json'))
let search_member;
if (process.platform === 'win32') {
  search_member = "C:\\Users\\Public\\search_member.json";
} else if (process.platform === 'darwin') {
  search_member = ""
} else {
  search_member = ""
}

client.on('ready', async () => {
  console.log(`${client.user.username} is ready!`);
});

/*
// FIXME - TypeError: Cannot read properties of undefined (reading 'send')
async function searchServerMembers(serverId, qry) {
  log.info("searchServerMembers ==== START" + "\n");
  log.info("qry", qry);
  log.info("serverId", serverId);
  try{
    let server = client?.guilds?.cache?.get(serverId);
    if (!server) server = await client?.guilds?.fetch(serverId);
    
    let membersFetched;
    if (qry !== "" && qry !== "null") {
        membersFetched = await server?.members?.fetch({ query: qry, limit: 10 });
    } else {
        membersFetched = await server?.members?.fetch({ limit: 10 });
    }
    log.info("membersFetched", membersFetched);


    let membersProcessed = membersFetched?.map(member => ({
        memberId: member?.id,
        memberName: member?.displayName,
    }));
    log.info("membersProcessed", membersProcessed);
    log.info("searchServerMembers ==== END");
    return membersProcessed;
  }catch(e){
      log.info("searchServerMembers error: " + e.toString());
      log.info("searchServerMembers ==== END");
      return []
  }
}
*/

async function searchServerMembers(serverId, qry) {
  log.info("Entering searchServerMembers...")
  try{
    log.info("searchServerMembers")
    log.info("serverID",serverId,'  qry= ',qry)
    let server = client?.guilds?.cache?.get(serverId);
    if (!server) server = await client?.guilds?.fetch(serverId);
    log.info("serverID",serverId,'  qry= ',qry)
    // Fetch members from the server
    let membersFetched;
    if (qry !== "" && qry !== "null") {
        membersFetched = await server?.members?.fetch({ query: qry, limit: 10 });
    } else {
        membersFetched = await server?.members?.fetch({ limit: 10 });
    }
    let membersProcessed= membersFetched?.map(member => ({
        memberId: member?.id,
        memberName: member?.displayName,
    }));
    log.info("membersProcessed: ", membersProcessed)
    return membersProcessed;
  }catch(e){
      log.info(e)
      return [];
  }
}

parentPort.on('message',async (parms) => {
  if (parms[0]=="search_members") {
    //search members
    log.info("parentPort.on('message',async (parms) => { if (parms[0]=='search_members') { ==== START" + "\n");
    log.info(`searchServerMembers call ==== ${parms[1]} ||  ${parms[2]}` + "\n");
    const members = await searchServerMembers(parms[1],parms[2])
    // log.info("Worker thread members: ", members)
    if(search_member){
   
    parentPort.postMessage(
      JSON.stringify( members
      ),"searched_memberse_data"
    );
    }
    /*
    try {
      parentPort.postMessage(
        JSON.stringify({
          type_message: "searched-members",
          membersCache: members
        })
      );
    } catch (e) {
      log.info("parentPort.postMessage error", e)
      fs.appendFileSync(logfile, "parentPort.postMessage error: "+e.toString())
    }
    */
    log.info(`searchServerMembers response ==== ${members}` + "\n");
    log.info("parentPort.on('message',async (parms) => { if (parms[0]=='search_members') { ==== END" + "\n");

  } else if (parms[0] == "send-message") {
    const client1 = new Discord.Client({ checkUpdate: false });
    client1.login(parms[3]);
    client1.on('ready', async () => {
      const channel = client1.channels.cache.get(parms[1]);
      if (channel) {
        channel.send(parms[2]);
      } else {
        console.log('Channel not found.');
      }
    });
  } else if (parms[0]=="send-auth-token"){
    client.login(parms[1]);
  } else if (parms[0]=="reply-message"){
    let messageFuncReply =  await sendMessageReply(parms[1],parms[2],parms[3])
  }else if (parms[0]=="search_path"){
   search_member  = parms[1]
  }
});

client.on('messageCreate', async (message) => {
 if(message){
  let newObj = JSON.stringify(message?.author)
  let newChannelObj = JSON.stringify(message?.channel)
  message.newauthor=JSON.parse(newObj)
  message.newchannel=JSON.parse(newChannelObj)
  if( message.type== "REPLY"){
    let channel = client?.channels?.cache?.get(message?.reference?.channelId)
    let messageNew = await channel?.messages?.fetch(message?.reference?.messageId)
    let pasedNewMessage = await getMessage(message?.guildId,message?.channelId,message?.id)
    let strigifyMessage = JSON.stringify(pasedNewMessage)
    message.replyMessageObj =JSON.parse(strigifyMessage)
  }
    message.newavatarURL = await getUserAvatarURL(message?.author?.id)
  try {
    parentPort.postMessage(JSON.stringify(message));
  } catch (e) {
  }
}
});

client.on('messageReactionAdd', async (reaction, user) => {
    // Skip bot reactions
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
    }
  }
);

client.on('messageDelete', async (message) => {
  // Get the message ID
  try {
    const messageId = message?.id;
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
}
})  
}
 