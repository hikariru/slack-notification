import fs from "fs";
import path from "path";
import {ExpressReceiver, LogLevel, App} from "@slack/bolt";

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET ?? '',
  logLevel: LogLevel.DEBUG,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  ignoreSelf: true,
  logLevel: LogLevel.DEBUG,
  receiver: receiver,
});

const listenersRoot = path.resolve('dist/', 'listeners') ;
fs.readdirSync(listenersRoot).forEach((directory: string) => {
  const directoryRoot = path.join(listenersRoot, directory);
  fs.readdirSync(directoryRoot).forEach((file: string) => {
    const extension = path.extname(file);
    if (extension !== ".js") {
      return;
    }
    const fullPath = path.join(directoryRoot, path.basename(file, extension));
    try {
      const script = require(fullPath);
      if (typeof script === 'function') {
        script(app, receiver);
        console.log(`Script has been loaded: ${fullPath}`)
      }
    } catch (err) {
      console.error(`Failed to load script: ${fullPath}`, err);
      throw err;
    }
  });
});

(async () => {
  await app.start(8080);
  console.log('app is running');
})();
