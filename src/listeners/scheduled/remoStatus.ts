import { SlackAPIClient } from "slack-web-api-client";
import { type Env, getRemoJobConfig } from "../../lib/config";
import logger from "../../lib/logger";
import { RemoRetriever } from "../../services/RemoRetriever";

const remoRetriever = new RemoRetriever();

export default async function remoStatusJob(env: Env): Promise<void> {
  const config = getRemoJobConfig(env);
  const status = await remoRetriever.getCurrentStatus(config);

  if (!status) {
    logger.error("Skipping remo status notification: failed to fetch Nature Remo status");
    return;
  }

  const { max: maxTemperature, min: minTemperature } = config.temperatureThreshold;
  const { max: maxHumidity, min: minHumidity } = config.humidityThreshold;
  let text = `:thermometer: ${status.temperature}℃ / ${status.humidity}% (${status.createdAt})`;

  // 事務所衛生基準規則5条3項
  if (
    status.temperature > maxTemperature ||
    status.temperature < minTemperature ||
    status.humidity > maxHumidity ||
    status.humidity < minHumidity
  ) {
    text = `<!channel> ${text}`;
  }

  try {
    const client = new SlackAPIClient(config.slackBotToken);
    const result = await client.chat.postMessage({ channel: config.slackChannelId, text });
    if (!result.ok) {
      logger.error("Slack API error:", result.error);
    }
  } catch (error) {
    logger.error("Failed to send remo status message:", error);
  }
}
