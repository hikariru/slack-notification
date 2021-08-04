import { ExpressReceiver } from "@slack/bolt";
import Logger from "./logger"

export const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET ?? '',
  logger: Logger
});
