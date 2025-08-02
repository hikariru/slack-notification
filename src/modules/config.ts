interface Config {
  app: {
    port: number;
    nodeEnv: string;
    isProduction: boolean;
  };
  weather: {
    defaultAreaId: string;
    notificationHour: number;
    apiEndpoint: string;
    naturesRemoApiEndpoint: string;
    naturesRemoToken: string;
    forecast: {
      pressureLevelThreshold: number;
      hourInterval: number;
    };
  };
  slack: {
    botToken: string;
    signingSecret: string;
    generalChannelId: string;
    weatherChannelId: string;
  };
  notification: {
    timezone: string;
    utcOffset: number;
    remoStatus: {
      hourInterval: number;
    };
  };
  remo: {
    token: string;
    thresholds: {
      temperature: {
        max: number;
        min: number;
      };
      humidity: {
        max: number;
        min: number;
      };
    };
  };
}

export const config: Config = {
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
      hourInterval: 4,
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
    thresholds: { // 事務所衛生基準規則
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
