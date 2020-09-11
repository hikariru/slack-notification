const moment = require('moment-timezone');
const getRemoStatus = require('../../modules/get_remo_status');
const maxTemperature = 28;
const minTemperature = 17;

module.exports = app => {
  app.receiver.app.get(`/slack/remo_status`, async(req, res) => {
    res.sendStatus(200);

    const currentHour = Number(moment().tz(process.env.TIMEZONE).hour());

    if (currentHour % 3 !== 0) {
      return;
    }

    try {
      const remoStatus = await getRemoStatus();
      const temperature = Math.round(remoStatus.value);
      let text = `室温は ${temperature}℃です :thermometer: (${remoStatus.createdAt})`;

      // 事務所衛生基準規則5条3項
      if (temperature > maxTemperature || temperature < minTemperature) {
        text = '<!channel> ' + text;
      }

      return app.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: process.env.WEATHER_CHANNEL_ID,
        text: text,
      });
    } catch (err) {
      console.error(err);
    }
  });
};
