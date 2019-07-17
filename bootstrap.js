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

  const bot = new SlackBotWorker(controller, {});
  loadFunctions('jobs', bot);
});

controller.webserver.get('/', (req, res) => {
  res.status(200);
  res.send('OK :D');
});


/**
 * @param {string} directoryName
 * @param {Object} attribute
 */
const loadFunctions = (directoryName, attribute) => {
  const directoryPath = Path.resolve('.', directoryName);

  Fs.readdirSync(directoryPath).forEach((file) => {
    const extension = Path.extname(file);
    const fullPath = Path.join(directoryPath, Path.basename(file, extension));
    try {
      const script = require(fullPath);
      if (typeof script === 'function') {
        script(attribute);
      }
    } catch (error) {
      process.exit(1);
    }
  });
};
