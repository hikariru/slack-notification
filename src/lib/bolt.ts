import { App } from "@slack/bolt";
import { config } from "./config";
import logger from "./logger";
import { receiver } from "./receiver";

export const bolt = new App({
  token: config.slack.botToken,
  signingSecret: config.slack.signingSecret,
  ignoreSelf: true,
  logger: logger,
  receiver: receiver,
});

bolt.error(async (error) => {
  logger.error("Slack App Error:", error);
});
