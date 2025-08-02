import express from 'express';
import { getRemoStatus } from '../../modules/getRemoStatus';
import { bolt } from '../../modules/bolt';
import { receiver } from '../../modules/receiver';
import { config } from '../../modules/config';
import { createTimeCheckMiddleware } from '../../modules/timeCheckMiddleware';

module.exports = () => {
  receiver.router.get(
    '/slack/remo_status',
    createTimeCheckMiddleware('interval')
  );

  const maxTemperature = config.remo.thresholds.temperature.max;
  const minTemperature = config.remo.thresholds.temperature.min;
  const maxHumidity = config.remo.thresholds.humidity.max;
  const minHumidity = config.remo.thresholds.humidity.min;
  // @ts-ignore
  receiver.router.get(`/slack/remo_status`, async (req, res, next) => {
    const remoStatus = await getRemoStatus();
    let text = `${remoStatus.temperature}℃ / ${remoStatus.humidity}% :thermometer: (${remoStatus.createdAt})`;

    // 事務所衛生基準規則5条3項
    if (
      remoStatus.temperature > maxTemperature ||
      remoStatus.temperature < minTemperature ||
      remoStatus.humidity > maxHumidity ||
      remoStatus.humidity < minHumidity
    ) {
      text = '<!channel> ' + text;
    }

    const weatherChannelId = config.slack.weatherChannelId;
    return bolt.client.chat.postMessage({
      token: config.slack.botToken,
      channel: weatherChannelId,
      text: text,
    });
  });
};
