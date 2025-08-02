import { receiver } from "../../modules/receiver";
import { bolt } from "../../modules/bolt";
import logger from "../../modules/logger";
import { config } from "../../modules/config";
import { createTimeCheckMiddleware } from "../../modules/timeCheckMiddleware";
import {
  getWeatherStatus,
  getPressureText,
  getWeatherText,
  filterImportantTimes,
  type WeatherStatus,
  type WeatherItem,
} from "../../modules/getWeatherStatus";

const formatWeatherMessage = (weather: WeatherStatus, forecast: WeatherItem[]): string => {
  const header = `📍 ${weather.placeName} (${weather.dateTime})`;

  if (forecast.length === 0) {
    return `${header}\n本日の特別な気圧変化はありません`;
  }

  const forecastLines = forecast.map((item) => {
    const timeText = `${item.time}時`;
    const tempText = `${item.temp}°C`;
    const weatherIcon = getWeatherText(item.weather);
    const pressureText = `${item.pressure}hPa`;
    const pressureIcon = getPressureText(item.pressureLevel);

    return `${timeText}: ${tempText} ${weatherIcon} ${pressureText} ${pressureIcon}`;
  });

  return [header, "", "今日の予報:", ...forecastLines].join("\n");
};

module.exports = () => {
  receiver.router.get("/slack/weather_status", createTimeCheckMiddleware("specificHour"));

  receiver.router.get("/slack/weather_status", async (_req, _res, _next) => {
    const weatherStatus = await getWeatherStatus();

    if (!weatherStatus.placeName) {
      return;
    }

    const importantTimes = filterImportantTimes(weatherStatus.todayForecast);
    const text = formatWeatherMessage(weatherStatus, importantTimes);

    const weatherChannelId = config.slack.weatherChannelId || config.slack.generalChannelId;

    try {
      const result = await bolt.client.chat.postMessage({
        token: config.slack.botToken,
        channel: weatherChannelId,
        text: text,
      });

      if (!result.ok) {
        logger.error("Slack API error:", result.error);
      }
    } catch (error) {
      logger.error("Failed to send weather status message:", error);
    }
  });
};
