import { bolt } from "../../modules/bolt";
import { config } from "../../modules/config";
import { getRemoStatus } from "../../modules/getRemoStatus";
import { receiver } from "../../modules/receiver";
import { createTimeCheckMiddleware } from "../../modules/timeCheckMiddleware";

module.exports = () => {
  receiver.router.get("/slack/remo_status", createTimeCheckMiddleware("interval"));

  const maxTemperature = config.remo.thresholds.temperature.max;
  const minTemperature = config.remo.thresholds.temperature.min;
  const maxHumidity = config.remo.thresholds.humidity.max;
  const minHumidity = config.remo.thresholds.humidity.min;

  receiver.router.get(`/slack/remo_status`, async (_req, _res, _next) => {
    const remoStatus = await getRemoStatus();
    let text = `:thermometer: ${remoStatus.temperature}℃ / ${remoStatus.humidity}% (${remoStatus.createdAt})`;

    // 事務所衛生基準規則5条3項
    if (
      remoStatus.temperature > maxTemperature ||
      remoStatus.temperature < minTemperature ||
      remoStatus.humidity > maxHumidity ||
      remoStatus.humidity < minHumidity
    ) {
      text = `<!channel> ${text}`;
    }

    const weatherChannelId = config.slack.weatherChannelId;
    return bolt.client.chat.postMessage({
      token: config.slack.botToken,
      channel: weatherChannelId,
      text: text,
    });
  });
};
