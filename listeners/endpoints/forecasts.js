const moment = require('moment-timezone');

const getWeatherReports = require('../../modules/get_weather_reports');
const buildForecastMessages = require('../../modules/build_forecast_messages');

module.exports = app => {
  app.receiver.app.get(`/slack/weather`, async (req, res) => {
    res.status(200).send('OK');

    const currentHour = Number(moment().tz(process.env.TIMEZONE).hour());
    if (currentHour !== 7 || currentHour !== 19) {
      return;
    }

    try {
      const reports = await getWeatherReports();
      const attachments = buildForecastMessages(reports);

      return app.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: process.env.CHANNEL_ID,
        text: `${reports.title} をお知らせします！`,
        attachments: attachments
      });
    } catch (err) {
      console.log(err);
    }
  });
};
