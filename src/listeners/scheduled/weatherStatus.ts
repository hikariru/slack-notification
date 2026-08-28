import { SlackAPIClient } from "slack-web-api-client";
import { type Env, getWeatherJobConfig } from "../../lib/config";
import logger from "../../lib/logger";
import { weatherMessageFormatter } from "../../services/WeatherMessageFormatter";

export default async function weatherStatusJob(env: Env): Promise<void> {
  const config = getWeatherJobConfig(env);

  try {
    const notificationData = await weatherMessageFormatter.prepareWeatherNotification({
      apiEndpoint: config.apiEndpoint,
      timezone: config.timezone,
      notificationHour: config.notificationHour,
      pressureLevelThreshold: config.pressureLevelThreshold,
    });

    if (!notificationData) {
      logger.warn("Weather data not available, skipping notification");
      return;
    }

    const client = new SlackAPIClient(config.slackBotToken);
    const result = await client.chat.postMessage({
      channel: config.slackChannelId,
      text: notificationData.message,
    });
    if (!result.ok) {
      logger.error("Slack API error:", result.error);
    }
  } catch (error) {
    logger.error("Failed to send weather status message:", error);
  }
}
