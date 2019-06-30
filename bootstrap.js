// require('dotenv').config();

let {Botkit} = require('botkit');
const {SlackAdapter} = require('botbuilder-adapter-slack')
  , Restify = require('restify')
  , Fs = require('fs')
  , Path = require('path')
;

/** @type {SlackAdapter} */
const adapter = new SlackAdapter({
  clientSigningSecret: process.env.SLACK_SECRET
  , botToken: process.env.SLACK_TOKEN
});


/** @type {Botkit} */
const controller = new Botkit({
  adapter: adapter
  , host: process.env.HOST
});

/** @type {Promise<BotWorker>} */
const bot = controller.spawn({
  token: process.env.SLACK_TOKEN,
});

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
        script(module);
      }
    } catch(error) {
      process.exit(1);
    }
  });
};

loadDirectory('cron', bot);
loadDirectory('scripts', controller);
