import express from 'express';
import { DateTime } from 'luxon';
import { receiver } from '../../modules/receiver';
import { bolt } from '../../modules/bolt';
import logger from '../../modules/logger';
import {
  getWeatherStatus,
  getPressureText,
  getWeatherText,
  filterImportantTimes,
  WeatherStatus,
  WeatherItem,
} from '../../modules/get_weather_status';

const NOTIFICATION_HOUR = 7;

const formatWeatherMessage = (
  weather: WeatherStatus,
  forecast: WeatherItem[],
): string => {
  const header = `📍 ${weather.placeName} (${weather.dateTime})`;

  if (forecast.length === 0) {
    return header + '\n本日の特別な気圧変化はありません';
  }

  const forecastLines = forecast.map((item) => {
    const timeText = `${item.time}時`;
    const tempText = `${item.temp}°C`;
    const weatherIcon = getWeatherText(item.weather);
    const pressureText = `${item.pressure}hPa`;
    const pressureIcon = getPressureText(item.pressureLevel);

    return `${timeText}: ${tempText} ${weatherIcon} ${pressureText} ${pressureIcon}`;
  });

  return [header, '', '今日の予報:', ...forecastLines].join('\n');
};

module.exports = () => {
  receiver.router.get(
    '/slack/weather_status',
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      res.sendStatus(202);

      const timezone = process.env.TIMEZONE ?? '';
      const currentHour = Number(DateTime.now().setZone(timezone).hour);

      if (currentHour !== NOTIFICATION_HOUR) {
        return;
      }

      await next();
    },
  );

  receiver.router.get('/slack/weather_status', async (req, res, next) => {
    const weatherStatus = await getWeatherStatus();

    if (!weatherStatus.placeName) {
      return;
    }

    const importantTimes = filterImportantTimes(weatherStatus.todayForecast);
    const text = formatWeatherMessage(weatherStatus, importantTimes);

    const weatherChannelId =
      process.env.WEATHER_CHANNEL_ID ?? process.env.GENERAL_CHANNEL_ID ?? '';

    try {
      const result = await bolt.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: weatherChannelId,
        text: text,
      });

      if (!result.ok) {
        logger.error('Slack API error:', result.error);
      }
    } catch (error) {
      logger.error('Failed to send weather status message:', error);
    }
  });
};
