const { Client } = require('discord.js-selfbot-v13');
const client = new Client({
    checkUpdate:false
	// See other options here
	// https://discordjs-self-v13.netlify.app/#/docs/docs/main/typedef/ClientOptions
	// All partials are loaded automatically
});

client.on('ready', async () => {
  console.log(`${client.user.username} is ready!`);
})
// client.on('messageCreate', async () => {
//     console.log(`messageCreate`);
//   })

  client.on('message', async (message) => {
    console.log(message);
  })
  
client.login('MTExNDEyOTQ1MjM4MTc4NjEzMw.GVAHUB.3GJZQ7DogAgxSklaKU8uPTYgMq9IiX8id6EhWI');