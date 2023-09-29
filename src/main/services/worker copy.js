require('events');


const fs = require('fs')
fs.appendFileSync("C:\\Users\\sourabh\\Documents\\demo\\simplifids\\logs\\log.txt","currunt dir"+__dirname+"\n")

const { MessageChannel } = require('node:worker_threads');
const {app} = require('../../../node_modules/electron');
const Store = require('../../../node_modules/electron-store');

const log = require('../../../node_modules/electron-log');
const Discord= require('discord.js-selfbot-v13');
const store = new Store();
const client = new Discord.Client({    checkUpdate: false, intents: ["DIRECT_MESSAGES", "GUILD_MESSAGES"] });
const discordToken =  store.get('discordToken');
log.transports.file.resolvePath = () =>"C:\\Users\\sourabh\\AppData\\Roaming\\simplifidis\\logs\\log.log";
log.info("worker thread")

const { workerData, parentPort, isMainThread } = require("worker_threads");
// fs.appendFileSync("C:\\Users\\sourabh\\Documents\\demo\\simplifids\\logs\\log.txt",discordToken)

client.on('ready', async () => {
	  console.log(`${client.user.username} is ready!`);
	  fs.appendFileSync("C:\\Users\\sourabh\\Documents\\demo\\simplifids\\logs\\log.txt"," is ready")
})
	
client.on('messageCreate', async (message) => {
	// console.log(`messageCreate`);
	fs.appendFileSync("C:\\Users\\sourabh\\Documents\\demo\\simplifids\\logs\\log.txt",message.toString())
	try{
		// if (message?.author?.bot) return; // Skip bot messages to avoid notification spam
		// const serverId =message?.guild?.id || null; // Get the server ID
		// const channelId =message?.channel?.id || null; // Get the channel ID
		// const memberId =message?.author?.id || null; // Get the member ID
		parentPort.postMessage(message);
		// const latestMessage = await getLatestMessages(message, serverId, channelId, memberId);
	
		// // Loop through the notificationsEnabledMap and check for a match
		// for (const deckId in notificationsEnabledMap) {
		//   if (notificationsEnabledMap[deckId] && isMatch(deckId, serverId, channelId, memberId)) {
		// 	const notification = new Notification({
		// 		title: 'New message in your deck',
		// 		body: latestMessage.content,  // Adjust this according to your needs
		// 	});
		// 	notification.show();
		// 	break; // If you want to send only one notification per message, break after the first match
		//   }
		// }
	}catch(e){
	   log.info(e)
	}
})


client.login(".GRR7x_.");