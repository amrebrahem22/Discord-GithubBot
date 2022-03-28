import express, {Request, Response} from 'express';
import { Client, TextChannel, MessageEmbed  } from 'discord.js';

const GithubWebHook = require('express-github-webhook');
const webhookHandler = GithubWebHook({ path: '/webhook', secret: 'secret' });

export function createRestApi(client: Client) {
    const app = express();
    app.use(express.json());

    app.use(webhookHandler);

    app.post('/github', async (req: Request, res: Response) => {
        const {title, html_url, user, body} = req.body.issue;
        console.log('Github post', req.body);
        const guild = client.guilds.cache.get(process.env.GUILD_ID as string)

        if (guild) {
            const channel = (guild.channels.cache.get("958056228343402516") as TextChannel );

            const issueEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(title)
                .setURL(html_url)
                .setAuthor({ name: user.login, iconURL: user.avatar_url, url: user.html_url })
                .setDescription(body)
                .setTimestamp();

            if (channel) channel.send({ embeds: [issueEmbed]})
        }
        res.json({ ok: 1, data: req.body });
    });

    return app;
}