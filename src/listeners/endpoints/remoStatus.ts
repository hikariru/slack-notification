import { bolt } from "../../lib/bolt";
import { config } from "../../lib/config";
import logger from "../../lib/logger";
import { receiver } from "../../lib/receiver";
import { createTimeCheckMiddleware } from "../../lib/timeCheckMiddleware";
import { remoRetriever } from "../../services/RemoRetriever";

export default () => {
  receiver.router.get("/slack/remo_status", createTimeCheckMiddleware("interval"));

  const { max: maxTemperature, min: minTemperature } = config.remo.thresholds.temperature;
  const { max: maxHumidity, min: minHumidity } = config.remo.thresholds.humidity;

  receiver.router.get("/slack/remo_status", async (_req, _res, _next) => {
    try {
      const remoStatus = await remoRetriever.getCurrentStatus();
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

      const result = await bolt.client.chat.postMessage({
        token: config.slack.botToken,
        channel: config.slack.weatherChannelId,
        text,
      });

      if (!result.ok) {
        logger.error("Slack API error:", result.error);
      }
    } catch (error) {
      logger.error("Failed to send remo status message:", error);
    }
  });
};
