// require('dotenv').config();

const {App} = require('@slack/bolt');
const Fs = require('fs');
const Path = require('path');

const app = new App({
  token: process.env.SLACK_TOKEN,
  signingSecret: process.env.SLACK_SECRET
  ignoreSelf: true,
  logLevel: 'DEBUG'
});

app.error((error) => {
  console.error(error)
})

(async () => {
  await app.start(process.env.PORT || 3000);
})();

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
