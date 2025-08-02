import { DateTime } from "luxon";
import { config } from "../modules/config";
import { getPressureText, type WeatherItem } from "../modules/getWeatherStatus";

export interface PressureData {
  time: string;
  pressure: string;
  pressureLevel: string;
  timestamp: DateTime;
}

export interface PressureResult {
  placeName: string;
  dateTime: string;
  pressureData: PressureData;
}

/**
 * 気圧データ処理サービス
 */
export class PressureService {
  /**
   * 現在時刻に最も近い気圧データを検索
   */
  findClosestPressureData(forecast: WeatherItem[]): PressureData | null {
    if (!forecast || forecast.length === 0) {
      return null;
    }

    const now = DateTime.now().setZone(config.notification.timezone);

    let closestItem: WeatherItem | null = null;
    let minDiff = Infinity;

    for (const item of forecast) {
      const itemHour = parseInt(item.time);
      const itemTime = now.set({ hour: itemHour, minute: 0, second: 0 });
      const diff = Math.abs(itemTime.diff(now, "minutes").minutes);

      if (diff < minDiff) {
        minDiff = diff;
        closestItem = item;
      }
    }

    if (!closestItem) {
      return null;
    }

    return {
      time: closestItem.time,
      pressure: closestItem.pressure,
      pressureLevel: closestItem.pressureLevel,
      timestamp: now.set({
        hour: parseInt(closestItem.time),
        minute: 0,
        second: 0,
      }),
    };
  }

  /**
   * 気圧データをユーザー向けメッセージにフォーマット
   */
  formatPressureMessage(placeName: string, pressureData: PressureData): string {
    const header = `📍 ${placeName} (${pressureData.time})時`;
    const pressureText = `${pressureData.pressure}hPa`;
    const pressureIcon = getPressureText(pressureData.pressureLevel);

    return [header, "", `現在の気圧:${pressureText} ${pressureIcon}`].join("\n");
  }

  /**
   * 天気ステータスから最適な気圧情報を抽出してフォーマット
   */
  async processPressureRequest(weatherStatus: {
    placeName: string;
    dateTime: string;
    todayForecast: WeatherItem[];
  }): Promise<PressureResult | null> {
    if (!weatherStatus.placeName) {
      return null;
    }

    const pressureData = this.findClosestPressureData(weatherStatus.todayForecast);
    if (!pressureData) {
      return null;
    }

    return {
      placeName: weatherStatus.placeName,
      dateTime: weatherStatus.dateTime,
      pressureData,
    };
  }
}

export const pressureService = new PressureService();
