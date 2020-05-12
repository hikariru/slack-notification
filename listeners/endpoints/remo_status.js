const getRemoStatus = require('../../modules/get_remo_status');

module.exports = app => {
  app.receiver.app.get(`/slack/remo_status`, async(req, res) => {
    res.sendStatus(200);

    const remoStatus = await getRemoStatus();
    return app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: process.env.CHANNEL_ID,
      text: `:thermometer: ${remoStatus.value}℃ (${remoStatus.createdAt})`,
    });
  });
};
