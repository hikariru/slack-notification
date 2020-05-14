const moment = require('moment-timezone');

module.exports = (reports) => {
  const currentHour = Number(moment().tz(process.env.TIMEZONE).hour());
  let forecast = {};
  if (currentHour <= 12) {
    forecast = reports.forecasts[0];
  }
  if (currentHour > 12) {
    forecast = reports.forecasts[1];
  }

  const attachments = [
    {
      title: `${forecast.dateLabel} (${forecast.date})`,
      fields: [
        {
          title: '天気',
          value: forecast.telop,
          short: false,
        },
      ],
      footer: reports.copyright.provider[0].name,
      ts: moment(reports.puplicTime).unix()
    },
  ];

  const max = forecast.temperature.max ? forecast.temperature.max.celsius : '-';
  const min = forecast.temperature.min ? forecast.temperature.min.celsius : '-';

  attachments[0].fields.push({
    title: '気温',
    value: `${max} / ${min}`,
    short: false,
  });

  return attachments;
};
