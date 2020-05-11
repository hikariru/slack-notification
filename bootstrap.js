const {App} = require('@slack/bolt');
const Fs = require('fs');
const Path = require('path');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const loadDirectory = (directoryName) => {
  const directoryPath = Path.resolve('.', directoryName);

  Fs.readdirSync(directoryPath).forEach((file) => {
    const extension = Path.extname(file);
    const fullPath = Path.join(directoryPath, Path.basename(file, extension));
    try {
      const script = require(fullPath);
      if (typeof script === 'function') {
        script(app);
      }
    } catch (error) {
      console.log('Failed to load scripts', error);
      process.exit(1);
    }
  });
};

loadDirectory("commands");
loadDirectory("events");
loadDirectory("messages");

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('App is running...');
})();
