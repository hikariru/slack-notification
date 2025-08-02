interface Config {
  app: {
    port: number;
    nodeEnv: string;
    isProduction: boolean;
  };
  weather: {
    defaultAreaId: string;
    notificationHour: number;
    zutoolApiEndpoint: string;
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
  };
  remo: {
    apiEndpoint: string;
    token: string;
    status: {
      hourInterval: number;
    };
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
    nodeEnv: process.env.NODE_ENV ?? "development",
    isProduction: process.env.NODE_ENV === "production",
  },
  weather: {
    defaultAreaId: process.env.FORECAST_AREA_ID ?? "13101",
    notificationHour: 6,
    zutoolApiEndpoint: "https://zutool.jp/api/getweatherstatus",
    forecast: {
      pressureLevelThreshold: 2,
      hourInterval: 3,
    },
  },
  slack: {
    botToken: process.env.SLACK_BOT_TOKEN ?? "",
    signingSecret: process.env.SLACK_SIGNING_SECRET ?? "",
    generalChannelId: process.env.GENERAL_CHANNEL_ID ?? "",
    weatherChannelId: process.env.WEATHER_CHANNEL_ID ?? "",
  },
  notification: {
    timezone: process.env.TIMEZONE ?? "Asia/Tokyo",
    utcOffset: Number(process.env.UTC_OFFSET) || 9,
  },
  remo: {
    apiEndpoint: "https://api.nature.global/1/devices",
    token: process.env.NATURE_REMO_TOKEN ?? "",
    status: {
      hourInterval: 4,
    },
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
