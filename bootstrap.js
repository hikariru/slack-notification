// require('dotenv').config();

const {Botkit} = require('botkit');
const {
  SlackAdapter
  , SlackMessageTypeMiddleware
  , SlackBotWorker
  , SlackEventMiddleware
} = require('botbuilder-adapter-slack');
const Path = require('path');
const Fs = require('fs');


const adapter = new SlackAdapter({
  clientSigningSecret: process.env.SLACK_SIGNING_SECRET
  , botToken: process.env.SLACK_BOT_TOKEN
});

adapter.use(new SlackMessageTypeMiddleware());
adapter.use(new SlackEventMiddleware());

/** @type {Botkit} */
const controller = new Botkit({
  debug: true
  , adapter: adapter
});

controller.ready(() => {
  controller.loadModules(__dirname + '/events');
  // cannot run due to bug: https://github.com/howdyai/botkit/issues/1705
  // controller.loadModules(__dirname + '/events');
});

controller.webserver.get('/', (req, res) => {
  res.status(200);
  res.send('OK :D');
});
