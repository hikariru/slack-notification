import express from 'express';
import moment from "moment-timezone";
import {getRemoStatus} from '../../modules/get_remo_status';
import { bolt } from "../../modules/bolt";
import { receiver } from "../../modules/receiver";

module.exports = () => {
  receiver.router.get('/slack/remo_status', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.sendStatus(202);

    const timezone = process.env.TIMEZONE ?? '';
    const currentHour = Number(moment().tz(timezone).hour());

    if (currentHour % 4 !== 0) {
      return;
    }

    await next();
  });

  const maxTemperature = 28;
  const minTemperature = 17;
  const maxHumidity = 70;
  const minHumidity = 40;
  receiver.router.get(`/slack/remo_status`, async () => {
    const remoStatus = await getRemoStatus();
    let text = `${remoStatus.temperature}℃ / ${remoStatus.humidity}% :thermometer: (${remoStatus.createdAt})`;

    // 事務所衛生基準規則5条3項
    if (remoStatus.temperature > maxTemperature || remoStatus.temperature < minTemperature
      || remoStatus.humidity > maxHumidity || remoStatus.humidity < minHumidity) {
      text = '<!channel> ' + text;
    }

    const weatherChannelId = process.env.WEATHER_CHANNEL_ID ?? '';
    return bolt.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: weatherChannelId,
      text: text,
  });
  });
};
