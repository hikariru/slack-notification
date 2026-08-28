import { describe, expect, it } from "vitest";
import { getRemoJobConfig, getWeatherJobConfig } from "./config";

const baseEnv = {
  SLACK_BOT_TOKEN: "xoxb-test",
  SLACK_SIGNING_SECRET: "signing-secret",
  NATURE_REMO_TOKEN: "remo-token",
  WEATHER_CHANNEL_ID: "C_WEATHER",
  GENERAL_CHANNEL_ID: "C_GENERAL",
};

describe("getRemoJobConfig", () => {
  it("builds config with defaults when optional vars are absent", () => {
    const config = getRemoJobConfig(baseEnv);

    expect(config).toEqual({
      apiEndpoint: "https://api.nature.global/1/devices",
      token: "remo-token",
      timezone: "Asia/Tokyo",
      slackBotToken: "xoxb-test",
      slackChannelId: "C_WEATHER",
      temperatureThreshold: { max: 28, min: 17 },
      humidityThreshold: { max: 70, min: 40 },
    });
  });

  it("respects a custom TIMEZONE", () => {
    const config = getRemoJobConfig({ ...baseEnv, TIMEZONE: "UTC" });
    expect(config.timezone).toBe("UTC");
  });

  it("throws when NATURE_REMO_TOKEN is missing", () => {
    const { NATURE_REMO_TOKEN: _drop, ...env } = baseEnv;
    expect(() => getRemoJobConfig(env)).toThrow(/NATURE_REMO_TOKEN/);
  });

  it("throws when WEATHER_CHANNEL_ID is missing", () => {
    const { WEATHER_CHANNEL_ID: _drop, ...env } = baseEnv;
    expect(() => getRemoJobConfig(env)).toThrow(/WEATHER_CHANNEL_ID/);
  });

  it("throws when SLACK_BOT_TOKEN is missing", () => {
    const { SLACK_BOT_TOKEN: _drop, ...env } = baseEnv;
    expect(() => getRemoJobConfig(env)).toThrow(/SLACK_BOT_TOKEN/);
  });
});

describe("getWeatherJobConfig", () => {
  it("builds config using WEATHER_CHANNEL_ID and default area/timezone", () => {
    const config = getWeatherJobConfig(baseEnv);

    expect(config).toEqual({
      apiEndpoint: "https://zutool.jp/api/getweatherstatus/13101",
      notificationHour: 6,
      pressureLevelThreshold: 2,
      timezone: "Asia/Tokyo",
      slackBotToken: "xoxb-test",
      slackChannelId: "C_WEATHER",
    });
  });

  it("respects a custom FORECAST_AREA_ID", () => {
    const config = getWeatherJobConfig({ ...baseEnv, FORECAST_AREA_ID: "40010" });
    expect(config.apiEndpoint).toBe("https://zutool.jp/api/getweatherstatus/40010");
  });

  it("falls back to GENERAL_CHANNEL_ID when WEATHER_CHANNEL_ID is absent", () => {
    const { WEATHER_CHANNEL_ID: _drop, ...env } = baseEnv;
    const config = getWeatherJobConfig(env);
    expect(config.slackChannelId).toBe("C_GENERAL");
  });

  it("throws when neither WEATHER_CHANNEL_ID nor GENERAL_CHANNEL_ID is set", () => {
    const { WEATHER_CHANNEL_ID: _a, GENERAL_CHANNEL_ID: _b, ...env } = baseEnv;
    expect(() => getWeatherJobConfig(env)).toThrow(/WEATHER_CHANNEL_ID|GENERAL_CHANNEL_ID/);
  });

  it("throws when SLACK_BOT_TOKEN is missing", () => {
    const { SLACK_BOT_TOKEN: _drop, ...env } = baseEnv;
    expect(() => getWeatherJobConfig(env)).toThrow(/SLACK_BOT_TOKEN/);
  });
});
