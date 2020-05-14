const moment = require('moment-timezone');

const getWeatherReports = require('../../modules/get_weather_reports');


module.exports = app => {
  app.receiver.app.get(`/weather`, async (req, res) => {
    res.status(200).send('OK');

    // const currentHour = Number(moment().tz(process.env.TIMEZONE).hour());
    // if (currentHour !== 7 || currentHour !== 19) {
    //   return;
    // }

    try {
      const reports = getWeatherReports();
      const attachments = buildForecastMessages(reports);

      return app.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: process.env.CHANNEL_ID,
        text: `${reports.title}`,
        attachments: attachments
      });
    } catch (err) {
      console.log(err);
    }
  });
};
