import { App } from "@slack/bolt";
import Logger from "./logger";
import { receiver } from "./receiver";

export const bolt = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  ignoreSelf: true,
  logger: Logger,
  receiver: receiver,
});
