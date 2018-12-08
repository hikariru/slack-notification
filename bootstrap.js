// require('dotenv').config();

const
  Botkit = require('./node_modules/botkit/lib/Botkit')
  , Fs = require('fs')
  , Path = require('path')
;

const controller = Botkit.slackbot({
  host: process.env.HOST,
});

const bot = controller.spawn({
  token: process.env.SLACK_TOKEN,
}).startRTM();

controller.setupWebserver(process.env.PORT || 5000, (error, webserver) => {
  controller
    .createWebhookEndpoints(controller.webserver)
    .createHomepageEndpoint(controller.webserver);
});

const loadDirectory = (directoryName, attribute) => {
  const directoryPath = Path.resolve('.', directoryName);

  Fs.readdirSync(directoryPath).forEach((file) => {
    const extension = Path.extname(file);
    const fullPath = Path.join(directoryPath, Path.basename(file, extension));
    try {
      const script = require(fullPath);
      if (typeof script === 'function') {
        script(attribute);
      }
    } catch(error) {
      bot.botkit.log('Failed to load scripts :(', error);
      process.exit(1);
    }
  });
};

loadDirectory('cron', bot);
loadDirectory('scripts', controller);
