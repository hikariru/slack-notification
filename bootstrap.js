// require('dotenv').config();

const {Botkit} = require('botkit');
const {SlackAdapter, SlackMessageTypeMiddleware} = require('botbuilder-adapter-slack');
const Restify = require('restify');
const Fs = require('fs');
const Path = require('path');

let adapter = new SlackAdapter({
  clientSigningSecret: process.env.SLACK_SECRET
  , botToken: process.env.SLACK_TOKEN
});


/** @type {Botkit} */
let controller = new Botkit({
  adapter: adapter
});

adapter.use(new SlackMessageTypeMiddleware());

/** @type {Promise<BotWorker>} */
const bot = controller.spawn();

/** @type {Server} */
const server = Restify.createServer();
server.listen();

server.get('/', function (req, res, next) {
  res.send(200, 'hi :)');
  next();
});

/**
 * @param {string} directoryName
 * @param {Object} module
 */
const loadDirectory = (directoryName, module) => {
  const directoryPath = Path.resolve('.', directoryName);

  Fs.readdirSync(directoryPath).forEach((file) => {
    const extension = Path.extname(file);
    const fullPath = Path.join(directoryPath, Path.basename(file, extension));
    try {
      const script = require(fullPath);
      if (typeof script === 'function') {
        script(module, adapter);
      }
    } catch(error) {
      process.exit(1);
    }
  });
};

loadDirectory('cron', bot);
loadDirectory('scripts', controller);
