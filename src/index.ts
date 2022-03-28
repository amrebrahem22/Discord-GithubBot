import { Client, Intents } from 'discord.js';
import {config} from 'dotenv';
config();

// new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready
client.once('ready', () => {
	console.log('Ready!');
});

// Login to Discord
client.login(token);