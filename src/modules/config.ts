export const config = {
  app: {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV ?? 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },
  weather: {
    defaultAreaId: process.env.FORECAST_AREA_ID ?? '13101',
    notificationHour: 7,
    apiEndpoint: 'https://zutool.jp/api/getweatherstatus',
    naturesRemoApiEndpoint: 'https://api.nature.global/1/devices',
    naturesRemoToken: process.env.NATURE_REMO_TOKEN ?? '',
    forecast: {
      pressureLevelThreshold: 2,
      hourInterval: 6,
    },
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
    remoStatus: {
      hourInterval: 4,
    },
  },
  remo: {
    token: process.env.NATURE_REMO_TOKEN ?? '',
    thresholds: {
      temperature: {
        max: 28,
        min: 17,
      },
      humidity: {
        max: 70,
        min: 40,
      },
    },
  },
};
