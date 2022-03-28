import { Client, Intents } from 'discord.js';
import { createRestApi } from './rest-api';
import {config} from 'dotenv';
config();

// new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready
client.once('ready', () => {
	console.log('Ready!');
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);


const PORT = process.env.PORT || 8000;

const api = createRestApi(client);

api.listen(PORT, () => {
    console.log(`[rest-api]: Bot rest-api is running on http://localhost:${PORT}`)
})