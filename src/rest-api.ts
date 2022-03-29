import express, {Request, Response} from 'express';
import { Client, TextChannel, MessageEmbed  } from 'discord.js';
import Issue from './models/Issue';

const GithubWebHook = require('express-github-webhook');
const webhookHandler = GithubWebHook({ path: '/webhook', secret: 'secret' });

export function createRestApi(client: Client) {
    const app = express();
    app.use(express.json());

    app.use(webhookHandler);

    app.post('/github', async (req: Request, res: Response) => {
        const {title, html_url, user, body, comment} = req.body.issue;
        
        const guild = client.guilds.cache.get(process.env.GUILD_ID as string)

        if (guild) {
            const channel = (guild.channels.cache.get("958056228343402516") as TextChannel );
            // if comment
            if(comment) {
                // channel.send('issue Reply');
                // // get thread id, and send this message
                // const issue = await Issue.findOne({title});
                // const thread = channel.threads.cache().get(issue.threadId);
            } else {
                // new issue
                const issueEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(title)
                .setURL(html_url)
                .setAuthor({ name: user.login, iconURL: user.avatar_url, url: user.html_url })
                .setDescription(body)
                .setTimestamp();

                channel.send({ embeds: [issueEmbed]});

                // create thread
                const thread = await (channel as TextChannel).threads.create({
                    name: `Github Issue ${Date.now()}`,
                    reason: `Support ticket for ${title}`
                });

                // TODO: store thread to database
                await Issue.create({title, body, threadId: thread.id, user: user.login});

                // send thread message
                thread.send(`**User** <@${user.login}>
                **Issue: ** ${title}`);
            }
        }
        res.json({ ok: 1, data: req.body });
    });

    return app;
}