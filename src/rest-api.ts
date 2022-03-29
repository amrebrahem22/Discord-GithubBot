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
            if(req.body.action !== 'opened') {
                // get thread id, and send this message
                Issue.findOne({title}, async (err: any, issue: { threadId: any; }) => {
                    if (err) console.log(err);

                    const thread = channel.threads.cache.find((i: { id: any }) => i.id === issue.threadId);

                    if (thread) thread.send(`**User** <@${comment?.user.login}>
                    **Comment: ** ${comment?.body}`);
                    });
                
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
                
                // send thread message
                thread.send(`**User** <@${user.login}>
                **Issue: ** ${title}`);

                // TODO: store thread to database
                await Issue.create({title, body, threadId: thread.id, user: user.login});

            }
        }
        res.json({ ok: 1, data: req.body });
    });

    return app;
}