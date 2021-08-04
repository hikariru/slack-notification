import { App as Bolt } from "@slack/bolt";
import { LogLevel } from "@slack/logger";
import { Logger } from "./logger";
import { Receiver } from "./receiver";

export const App = new Bolt({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  ignoreSelf: true,
  logLevel: LogLevel.WARN,
  logger: Logger,
  receiver: Receiver,
});
