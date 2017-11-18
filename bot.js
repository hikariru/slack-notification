// require('dotenv').config();

const Botkit = require('./node_modules/botkit/lib/Botkit');
const Fs = require('fs');
const Path = require('path');
const redis = require('./node_modules/botkit-storage-redis/');
const url = require('url');

const redisUrl = url.parse(process.env.REDISCLOUD_URL);
const redisConfig = {
  namespace: 'slackbot:store',
  host: redisUrl.hostname,
  port: redisUrl.port,
  auth_pass: redisUrl.auth.split(':')[1],
};
const redisStorage = redis(redisConfig);

const controller = Botkit.slackbot({
  storage: redisStorage,
  host: process.env.HOST,
});

const bot = controller.spawn({
  token: process.env.SLACK_TOKEN,
}).startRTM();

controller.setupWebserver(process.env.PORT, (error, webserver) => {
  controller.createWebhookEndpoints(controller.webserver);

  controller.createOauthEndpoints(controller.webserver, function(error, request, response) {
    if (error) {
      response.status(500).send('Error: ' + JSON.stringify(error));
    } else {
      response.send('Success! See you on your Slack team.');
    }
  });

  controller.webserver.get('/', (request, response) => {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end(';)');
  });
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
