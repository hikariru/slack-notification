import { ExpressReceiver } from "@slack/bolt";
import { Logger } from "./logger"

export const Receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET ?? '',
  logger: Logger
});
