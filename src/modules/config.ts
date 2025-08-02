export const config = {
  weather: {
    defaultAreaId: process.env.FORECAST_AREA_ID ?? '13101',
    notificationHour: 7,
    apiEndpoint: 'https://zutool.jp/api/getweatherstatus',
    naturesRemoApiEndpoint: 'https://api.nature.global/1/devices',
    naturesRemoToken: process.env.NATURE_REMO_TOKEN ?? '',
  },
  slack: {
    botToken: process.env.SLACK_BOT_TOKEN ?? '',
    signingSecret: process.env.SLACK_SIGNING_SECRET ?? '',
    generalChannelId: process.env.GENERAL_CHANNEL_ID ?? '',
    weatherChannelId: process.env.WEATHER_CHANNEL_ID ?? '',
  },
  notification: {
    timezone: process.env.TIMEZONE ?? 'Asia/Tokyo',
    utcOffset: Number(process.env.UTC_OFFSET) || 9,
  },
  remo: {
    token: process.env.NATURE_REMO_TOKEN ?? '',
  },
};
