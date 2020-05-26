const moment = require('moment-timezone');

const mognaviUrl = 'https://mognavi.jp/do/whats_new/show';
const tuesday = 3;

module.exports = app => {
  app.receiver.app.get(`/slack/weather`, async (req, res) => {
    res.status(200).send('OK');

    const today = Number(moment().tz(process.env.TIMEZONE).day());
    if (today !== tuesday) {
      return;
    }

    try {
      return app.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: process.env.GENERAL_CHANNEL_ID,
        text: `コンビニの新商品です :pudding: ${mognaviUrl}`
      });
    } catch (err) {
      console.log(err);
    }
  });
};
