import { ExpressReceiver } from "@slack/bolt";
import { config } from "./config";
import logger from "./logger";

export const receiver = new ExpressReceiver({
  signingSecret: config.slack.signingSecret,
  logger: logger,
  processBeforeResponse: true,
});
