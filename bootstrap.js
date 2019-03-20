// require('dotenv').config();

const
  Botkit = require('./node_modules/botkit/lib/Botkit')
  , Fs = require('fs')
  , Path = require('path')
;

/** @type {Botkit.SlackController} */
const controller = Botkit.slackbot({
  host: process.env.HOST,
});

/** @type {Botkit.SlackBot} */
const bot = controller.spawn({
  token: process.env.SLACK_TOKEN,
}).startRTM();

controller.setupWebserver(process.env.PORT || 5000, (error, webserver) => {
  controller
    .createWebhookEndpoints(controller.webserver, [process.env.SLACK_TOKEN, process.env.VERIFICATION_TOKEN])
    .createHomepageEndpoint(controller.webserver);
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
      bot.botkit.log('Failed to load scripts :(', error);
      process.exit(1);
    }
  });
};

loadDirectory('cron', bot);
loadDirectory('scripts', controller);
