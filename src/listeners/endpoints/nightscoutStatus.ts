import { bolt } from "../../lib/bolt";
import { config } from "../../lib/config";
import logger from "../../lib/logger";
import { receiver } from "../../lib/receiver";
import { createTimeCheckMiddleware } from "../../lib/timeCheckMiddleware";
import { nightscoutMessageFormatter } from "../../services/NightscoutMessageFormatter";
import { nightscoutRetriever } from "../../services/NightscoutRetriever";

export default () => {
  receiver.router.get(
    "/slack/nightscout_status",
    createTimeCheckMiddleware("interval", {
      hourInterval: config.nightscout.status.hourInterval,
    })
  );

  receiver.router.get("/slack/nightscout_status", async (_req, _res, _next) => {
    try {
      const status = await nightscoutRetriever.getRecentStatus();

      if (status.readingCount === 0) {
        logger.warn("No Nightscout data available, skipping notification");
        return;
      }

      const text = nightscoutMessageFormatter.formatMessage(status);
      const channel = config.slack.nightscoutChannelId || config.slack.generalChannelId;

      const result = await bolt.client.chat.postMessage({
        token: config.slack.botToken,
        channel,
        text,
      });

      if (!result.ok) {
        logger.error("Slack API error:", result.error);
      }
    } catch (error) {
      logger.error("Failed to send nightscout status message:", error);
    }
  });
};
