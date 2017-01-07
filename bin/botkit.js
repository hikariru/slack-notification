const Botkit = require('../node_modules/botkit/lib/Botkit.js');
const Fs = require('fs');
const Path = require('path');
const http = require('http');

const controller = Botkit.slackbot({
  debug: false
});

const bot = controller.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM();

require('../cron/garbage')(bot);

const load = (path, file) => {
  const ext = Path.extname(file);
  const full = Path.join(path, Path.basename(file, ext));
  try {
    const script = require(full);
    if (typeof script === 'function') {
      script(controller);
    }
  } catch(error) {
    console.log(error);
    process.exit(1);
  }
};

const path = Path.resolve('.', 'scripts');

Fs.readdirSync(path).sort().forEach((file) => load(path, file));

http.createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Ok, dyno is awake.');
}).listen(process.env.PORT || 3000);
