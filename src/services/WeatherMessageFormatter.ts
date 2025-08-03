import { pressureIconFormatter } from "./PressureIconFormatter";
import { timeFilterService } from "./TimeFilterService";
import { weatherIconFormatter } from "./WeatherIconFormatter";
import { type WeatherItem, type WeatherForecast, weatherRetriever } from "./WeatherRetriever";

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
export class WeatherMessageFormatter {
  /**
   * 天気予報データを通知用メッセージにフォーマット
   */
  formatWeatherMessage(weather: WeatherForecast, forecast: WeatherItem[]): string {
    const header = `:round_pushpin: ${weather.placeName} (${weather.dateTime}時)`;

    if (forecast.length === 0) {
      return `${header}\n本日の特別な気圧変化はありません`;
    }

    const forecastLines = forecast.map((item) => {
      const timeText = `${item.time}時`;
      const tempText = `${item.temp}°C`;
      const weatherIcon = weatherIconFormatter.getWeatherText(item.weather);
      const pressureText = `${item.pressure}hPa`;
      const pressureIcon = pressureIconFormatter.getPressureText(item.pressureLevel);

      return `${timeText}: ${tempText} ${weatherIcon} ${pressureText} ${pressureIcon}`;
    });

    return [header, "", "今日の予報:", ...forecastLines].join("\n");
  }

  /**
   * 天気予報通知の準備処理
   * データ取得、重要時間のフィルタリング、メッセージフォーマットを一括処理
   */
  async prepareWeatherNotification(): Promise<WeatherNotificationData | null> {
    const forecast = await weatherRetriever.getForecast();

    if (!forecast.placeName) {
      return null;
    }

    const importantTimes = timeFilterService.filterImportantTimes(forecast.todayForecast);
    const message = this.formatWeatherMessage(forecast, importantTimes);

    return {
      placeName: forecast.placeName,
      dateTime: forecast.dateTime,
      forecast: importantTimes,
      message,
    };
  }
}

export const weatherMessageFormatter = new WeatherMessageFormatter();
