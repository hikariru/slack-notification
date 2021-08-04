import { ExpressReceiver } from "@slack/bolt";
import { LogLevel } from "@slack/logger";
import { Logger } from "./logger"

export const Receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET ?? '',
  logLevel: LogLevel.WARN,
  logger: Logger
});
