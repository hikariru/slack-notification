import { DateTime } from "luxon";
import { config } from "../lib/config";
import type { WeatherItem } from "./WeatherRetriever";

/**
 * 時間フィルターサービス
 * 天気予報データから重要な時間帯をフィルタリング
 */
export class TimeFilterService {
  /**
   * 重要な時間帯の天気予報をフィルタリング
   */
  /**
   * 重要な時間帯の天気予報をフィルタリング
   * 前の時間と比較して天気か気圧のステータスが変化した場合のみ表示
   */
  filterImportantTimes(forecast: WeatherItem[]): WeatherItem[] {
    const currentHour = DateTime.now().setZone(config.notification.timezone).hour;
    const result: WeatherItem[] = [];

    // 現在時刻以降のデータのみ対象
    const futureItems = forecast.filter((item) => {
      const itemHour = parseInt(item.time);

      // 朝6時の通知時は6時以降全て対象
      if (currentHour === config.weather.notificationHour) {
        return itemHour >= config.weather.notificationHour;
      }

      return itemHour > currentHour;
    });

    if (futureItems.length === 0) return result;

    // 最初のアイテムは必ず含める（基準点として）
    result.push(futureItems[0]);

    // 2番目以降は変化があった場合のみ含める
    for (let i = 1; i < futureItems.length; i++) {
      const previous = futureItems[i - 1];
      const current = futureItems[i];

      // 天気の変化をチェック
      const weatherChanged = previous.weather !== current.weather;

      // 気圧レベルの変化をチェック
      const prevPressureLevel =
        typeof previous.pressureLevel === "string"
          ? parseInt(previous.pressureLevel)
          : parseInt(previous.pressureLevel);
      const currPressureLevel =
        typeof current.pressureLevel === "string"
          ? parseInt(current.pressureLevel)
          : parseInt(current.pressureLevel);
      const pressureLevelChanged = prevPressureLevel !== currPressureLevel;

      // 気圧レベルが閾値以上（重要な変化）
      const isImportantPressure =
        currPressureLevel >= config.weather.forecast.pressureLevelThreshold;

      // 変化があった場合、または重要な気圧レベルの場合に含める
      if (weatherChanged || pressureLevelChanged || isImportantPressure) {
        result.push(current);
      }
    }

    return result;
  }
}

export const timeFilterService = new TimeFilterService();
