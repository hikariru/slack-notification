import {
  getWeatherStatus,
  getPressureText,
  getWeatherText,
  filterImportantTimes,
  type WeatherStatus,
  type WeatherItem,
} from "../modules/getWeatherStatus";

export interface WeatherNotificationData {
  placeName: string;
  dateTime: string;
  forecast: WeatherItem[];
  message: string;
}

/**
 * 天気予報通知サービス
 * 天気データの処理とメッセージフォーマットを担当
 */
export class WeatherService {
  /**
   * 天気予報データを通知用メッセージにフォーマット
   */
  formatWeatherMessage(weather: WeatherStatus, forecast: WeatherItem[]): string {
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
  }

  /**
   * 天気予報通知の準備処理
   * データ取得、重要時間のフィルタリング、メッセージフォーマットを一括処理
   */
  async prepareWeatherNotification(): Promise<WeatherNotificationData | null> {
    const weatherStatus = await getWeatherStatus();

    if (!weatherStatus.placeName) {
      return null;
    }

    const importantTimes = filterImportantTimes(weatherStatus.todayForecast);
    const message = this.formatWeatherMessage(weatherStatus, importantTimes);

    return {
      placeName: weatherStatus.placeName,
      dateTime: weatherStatus.dateTime,
      forecast: importantTimes,
      message,
    };
  }
}

export const weatherService = new WeatherService();
