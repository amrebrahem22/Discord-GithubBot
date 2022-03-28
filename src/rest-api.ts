import express, {Request, Response} from 'express';
import { Client } from 'discord.js';

const GithubWebHook = require('express-github-webhook');
const webhookHandler = GithubWebHook({ path: '/webhook', secret: 'secret' });

export function createRestApi(client: Client) {
    const app = express();
    app.use(express.json());

    app.use(webhookHandler);

    app.post('/github', function(req, res) {
        console.log('Github post', req.body);
        res.json({ ok: 1, data: req.body }); // Doesn't matter, can be any response
    });
    app.get('/github', function(req, res) {
        res.send('Github get Should be ok now'); // Doesn't matter, can be any response
    });

    return app;
}