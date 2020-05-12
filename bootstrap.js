const {App} = require('@slack/bolt');
const fs = require('fs');
const path = require('path');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  ignoreSelf: true,
  logLevel: 'DEBUG',
});

const listenersRoot = path.resolve('.', 'listeners');
fs.readdirSync(listenersRoot).forEach((directory) => {
  const directoryRoot = path.join(listenersRoot, directory);
  fs.readdirSync(directoryRoot).forEach((file) => {
    const extension = path.extname(file);
    const fullPath = path.join(directoryRoot, path.basename(file, extension));
    try {
      const script = require(fullPath);
      if (typeof script === 'function') {
        script(app);
        console.log(`Script has been loaded: ${fullPath}`)
      }
    } catch (err) {
      console.log(`Failed to load script: ${fullPath}`, err);
      process.exit(1);
    }
  });
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('App is running!');
})();
