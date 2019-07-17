require('dotenv').config();

const {Botkit} = require('botkit');
const {
  SlackAdapter
  , SlackMessageTypeMiddleware
  , SlackBotWorker
  , SlackEventMiddleware
} = require('botbuilder-adapter-slack');
const Restify = require('restify');
const Fs = require('fs');
const Path = require('path');

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
  // controller.loadModules(__dirname + '/jobs');
});

controller.webserver.get('/', (req, res) => {
  res.status(200);
  res.send('OK :D');
});


// /** @type {SlackBotWorker} */
// const bot = new SlackBotWorker(controller, {});


// /**
//  * @param {string} directoryName
//  * @param {Object} module
//  */
// const loadDirectory = (directoryName, module) => {
//   const directoryPath = Path.resolve('.', directoryName);
//
//   Fs.readdirSync(directoryPath).forEach((file) => {
//     const extension = Path.extname(file);
//     const fullPath = Path.join(directoryPath, Path.basename(file, extension));
//     try {
//       const script = require(fullPath);
//       if (typeof script === 'function') {
//         script(module, adapter);
//       }
//     } catch(error) {
//       process.exit(1);
//     }
//   });
// };
//
// loadDirectory('jobs', bot);
// loadDirectory('events', controller);
//
// /** @type {Server} */
// const server = Restify.createServer();
// server.listen();
// server.use(Restify.plugins.acceptParser(server.acceptable));
// server.use(Restify.plugins.queryParser());
// server.use(Restify.plugins.bodyParser());
//
// server.get('/', function (req, res, next) {
//   res.send(200, 'hi :)');
//   next();
// });
