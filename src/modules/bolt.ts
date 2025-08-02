import { App } from "@slack/bolt";
import logger from "./logger";
import { receiver } from "./receiver";
import { config } from "./config";

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
