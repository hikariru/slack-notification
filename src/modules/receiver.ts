import { ExpressReceiver } from '@slack/bolt';
import logger from './logger';

export const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET ?? '',
  logger: logger,
});
