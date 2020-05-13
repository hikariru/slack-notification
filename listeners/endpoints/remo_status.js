const moment = require('moment-timezone');
const getRemoStatus = require('../../modules/get_remo_status');

module.exports = app => {
  app.receiver.app.get(`/slack/remo_status`, async(req, res) => {
    res.sendStatus(200);

    const currentHour = moment().tz(process.env.TIME_ZONE).getHours();

    // うるさいので3時間ごとにしかPOSTさせない
    if (currentHour % 3 !== 0) {
      return;
    }

    try {
      const remoStatus = await getRemoStatus();
      return app.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: process.env.CHANNEL_ID,
        text: `室温は ${remoStatus.value}℃です :thermometer: (${remoStatus.createdAt})`,
      });
    } catch (err) {
      console.log(err);
    }
  });
};
