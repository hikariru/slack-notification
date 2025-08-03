import { receiver } from "../../lib/receiver";
import { bolt } from "../../lib/bolt";
import logger from "../../lib/logger";
import { config } from "../../lib/config";
import { createTimeCheckMiddleware } from "../../lib/timeCheckMiddleware";
import { weatherMessageFormatter } from "../../services/WeatherMessageFormatter";

export default () => {
  receiver.router.get("/slack/weather_status", createTimeCheckMiddleware("specificHour"));

  receiver.router.get("/slack/weather_status", async (_req, _res, _next) => {
    try {
      const notificationData = await weatherMessageFormatter.prepareWeatherNotification();

      if (!notificationData) {
        logger.warn("Weather data not available, skipping notification");
        return;
      }

      const weatherChannelId = config.slack.weatherChannelId || config.slack.generalChannelId;

      const result = await bolt.client.chat.postMessage({
        token: config.slack.botToken,
        channel: weatherChannelId,
        text: notificationData.message,
      });

      if (!result.ok) {
        logger.error("Slack API error:", result.error);
      }
    } catch (error) {
      logger.error("Failed to send weather status message:", error);
    }
  });
};
