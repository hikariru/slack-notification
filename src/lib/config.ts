export interface Env {
  SLACK_BOT_TOKEN?: string;
  SLACK_SIGNING_SECRET?: string;
  NATURE_REMO_TOKEN?: string;
  GENERAL_CHANNEL_ID?: string;
  WEATHER_CHANNEL_ID?: string;
  FORECAST_AREA_ID?: string;
  TIMEZONE?: string;
}

const requireString = (env: Env, key: keyof Env): string => {
  const value = env[key];
  if (!value) {
    throw new Error(`${key} is required`);
  }
  return value;
};

export interface RemoJobConfig {
  apiEndpoint: string;
  token: string;
  timezone: string;
  slackBotToken: string;
  slackChannelId: string;
  temperatureThreshold: { max: number; min: number };
  humidityThreshold: { max: number; min: number };
}

export const getRemoJobConfig = (env: Env): RemoJobConfig => ({
  apiEndpoint: "https://api.nature.global/1/devices",
  token: requireString(env, "NATURE_REMO_TOKEN"),
  timezone: env.TIMEZONE || "Asia/Tokyo",
  slackBotToken: requireString(env, "SLACK_BOT_TOKEN"),
  slackChannelId: requireString(env, "WEATHER_CHANNEL_ID"),
  temperatureThreshold: { max: 28, min: 17 },
  humidityThreshold: { max: 70, min: 40 },
});

export interface WeatherJobConfig {
  apiEndpoint: string;
  notificationHour: number;
  pressureLevelThreshold: number;
  timezone: string;
  slackBotToken: string;
  slackChannelId: string;
}

export const getWeatherJobConfig = (env: Env): WeatherJobConfig => {
  const areaId = env.FORECAST_AREA_ID || "13101";
  const slackChannelId = env.WEATHER_CHANNEL_ID || env.GENERAL_CHANNEL_ID;
  if (!slackChannelId) {
    throw new Error("WEATHER_CHANNEL_ID or GENERAL_CHANNEL_ID is required");
  }

  return {
    apiEndpoint: `https://zutool.jp/api/getweatherstatus/${areaId}`,
    notificationHour: 6,
    pressureLevelThreshold: 2,
    timezone: env.TIMEZONE || "Asia/Tokyo",
    slackBotToken: requireString(env, "SLACK_BOT_TOKEN"),
    slackChannelId,
  };
};
