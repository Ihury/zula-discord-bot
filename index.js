const { Client, Intents } = require('discord.js');

console.log(process.env, process.NODE_ENV)

const client = new Client({ intents: Object.keys(Intents.FLAGS) });

client.login(process.env.TOKEN);

// mostra uma mensagem no terminal quando o client estiver pronto
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});