import { ExpressReceiver } from "@slack/bolt";
import logger from "./logger";
import { config } from "./config";

export const receiver = new ExpressReceiver({
  signingSecret: config.slack.signingSecret,
  logger: logger,
  processBeforeResponse: true,
});
