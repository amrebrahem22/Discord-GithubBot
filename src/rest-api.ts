import express, {Request, Response} from 'express';
import { Client } from 'discord.js';

const GithubWebHook = require('express-github-webhook');
const webhookHandler = GithubWebHook({ path: '/webhook', secret: 'secret' });

export function createRestApi(client: Client) {
    const app = express();
    app.use(express.json());

    app.use(webhookHandler);

    webhookHandler.on('*', function (event: any, repo: any, data: any) {
        console.log('GITHUB: ', {event, repo, data})
    });
     
    webhookHandler.on('event', function (repo: any, data: any) {
        console.log('GITHUB: ', {repo, data})
    });
     
    webhookHandler.on('reponame', function (event: any, data: any) {
        console.log('GITHUB: ', {event, data})
    });
     
    webhookHandler.on('error', function (err: any, req: any, res: any) {
        console.log('GITHUB: ', {req, res, err})
    });

    return app;
}