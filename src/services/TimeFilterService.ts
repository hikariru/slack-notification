import { DateTime } from "luxon";
import { config } from "../lib/config";
import { type WeatherItem } from "./WeatherRetriever";

/**
 * 時間フィルターサービス
 * 天気予報データから重要な時間帯をフィルタリング
 */
export class TimeFilterService {
  /**
   * 重要な時間帯の天気予報をフィルタリング
   */
  filterImportantTimes(forecast: WeatherItem[]): WeatherItem[] {
    const currentHour = DateTime.now().setZone(config.notification.timezone).hour;

    return forecast.filter((item) => {
      const itemHour = parseInt(item.time);

      if (currentHour === config.weather.notificationHour) {
        return itemHour >= config.weather.notificationHour;
      }

      if (itemHour <= currentHour) return false;

      // Convert pressureLevel to number for comparison if it's a string
      const pressureLevelValue =
        typeof item.pressureLevel === "string"
          ? parseInt(item.pressureLevel)
          : parseInt(item.pressureLevel);

      if (pressureLevelValue >= config.weather.forecast.pressureLevelThreshold) return true;

      return (itemHour - currentHour) % config.weather.forecast.hourInterval === 0;
    });
  }
}

export const timeFilterService = new TimeFilterService();
