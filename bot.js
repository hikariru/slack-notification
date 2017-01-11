const Botkit = require('./node_modules/botkit/lib/Botkit');
const Fs = require('fs');
const Path = require('path');
const http = require('http');

const controller = Botkit.slackbot({
  debug: false
});

const bot = controller.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM();

const loadCronJob = (path, file) => {
  "use strict";
  const extension = Path.extname(file);
  const fullPath = Path.join(path, Path.basename(file, extension));
  try {
    const cron = require(fullPath);
    if (typeof cron === 'function') {
      cron(bot);
    }
  } catch(error) {
    bot.botkit.log('Failed to load cron jobs :(', error);
    process.exit(1);
  }
};

const loadScripts = (path, file) => {
  const ext = Path.extname(file);
  const full = Path.join(path, Path.basename(file, ext));
  try {
    const script = require(full);
    if (typeof script === 'function') {
      script(controller);
    }
  } catch(error) {
    bot.botkit.log('Failed to load scripts :(', error);
    process.exit(1);
  }
};

const cronJobPath = Path.resolve('.', 'cron');
Fs.readdirSync(cronJobPath).sort().forEach((file) => loadCronJob(cronJobPath, file));

const scriptPath = Path.resolve('.', 'scripts');
Fs.readdirSync(scriptPath).sort().forEach((file) => loadScripts(scriptPath, file));

http.createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Ok, dyno is awake.');
}).listen(process.env.PORT || 3000);
