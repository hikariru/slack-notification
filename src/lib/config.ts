const requireString = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`- ${key}: is required`);
  }
  return value;
};

const toInt = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  if (value === undefined || value === "") return defaultValue;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`- ${key}: must be an integer`);
  }
  return parsed;
};

const validateEnvironment = () => {
  const errors: string[] = [];
  const collect = <T>(fn: () => T, fallback: T): T => {
    try {
      return fn();
    } catch (e) {
      if (e instanceof Error) errors.push(e.message);
      return fallback;
    }
  };

  const nodeEnv = process.env.NODE_ENV ?? "development";
  if (!["development", "production", "test"].includes(nodeEnv)) {
    errors.push(`- NODE_ENV: must be "development", "production", or "test"`);
  }
  const isProduction = nodeEnv === "production";

  const slackBotToken = collect(() => requireString("SLACK_BOT_TOKEN"), "");
  const slackSigningSecret = collect(() => requireString("SLACK_SIGNING_SECRET"), "");
  const port = collect(() => toInt("PORT", 3000), 3000);
  const httpTimeout = collect(() => toInt("HTTP_TIMEOUT", 10000), 10000);
  const httpMaxRetries = collect(() => toInt("HTTP_MAX_RETRIES", 3), 3);
  const utcOffset = collect(() => toInt("UTC_OFFSET", 9), 9);

  const generalChannelId = process.env.GENERAL_CHANNEL_ID ?? "";
  const weatherChannelId = process.env.WEATHER_CHANNEL_ID ?? "";
  const natureRemoToken = process.env.NATURE_REMO_TOKEN ?? "";

  if (isProduction) {
    if (!generalChannelId) errors.push("- GENERAL_CHANNEL_ID: is required in production");
    if (!weatherChannelId) errors.push("- WEATHER_CHANNEL_ID: is required in production");
    if (!natureRemoToken) errors.push("- NATURE_REMO_TOKEN: is required in production");
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join("\n")}`);
  }

  return {
    nodeEnv: nodeEnv as "development" | "production" | "test",
    port,
    slackBotToken,
    slackSigningSecret,
    generalChannelId,
    weatherChannelId,
    natureRemoToken,
    forecastAreaId: process.env.FORECAST_AREA_ID || "13101",
    timezone: process.env.TIMEZONE || "Asia/Tokyo",
    utcOffset,
    httpTimeout,
    httpMaxRetries,
  };
};

const env = validateEnvironment();

export const config = {
  app: {
    port: env.port,
    nodeEnv: env.nodeEnv,
    isProduction: env.nodeEnv === "production",
  },
  http: {
    timeout: env.httpTimeout,
    maxRetries: env.httpMaxRetries,
    retryDelay: 1000,
    retryMultiplier: 2,
  },
  weather: {
    defaultAreaId: env.forecastAreaId,
    notificationHour: 6,
    zutoolApiEndpoint: "https://zutool.jp/api/getweatherstatus",
    forecast: {
      pressureLevelThreshold: 2,
      hourInterval: 3,
    },
  },
  slack: {
    botToken: env.slackBotToken,
    signingSecret: env.slackSigningSecret,
    generalChannelId: env.generalChannelId,
    weatherChannelId: env.weatherChannelId,
  },
  notification: {
    timezone: env.timezone,
    utcOffset: env.utcOffset,
  },
  remo: {
    apiEndpoint: "https://api.nature.global/1/devices",
    token: env.natureRemoToken,
    status: {
      hourInterval: 3,
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
} as const satisfies Record<string, unknown>;
