import { getPressureIcon } from "./PressureIconFormatter";
import { timeFilterService } from "./TimeFilterService";
import { getWeatherIcon } from "./WeatherIconFormatter";
import { type WeatherForecast, type WeatherItem, weatherRetriever } from "./WeatherRetriever";

export interface WeatherNotificationConfig {
  apiEndpoint: string;
  timezone: string;
  notificationHour: number;
  pressureLevelThreshold: number;
}

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
      const weatherIcon = getWeatherIcon(item.weather);
      const pressureText = `${item.pressure}hPa`;
      const pressureIcon = getPressureIcon(item.pressureLevel);

      return `${timeText}: ${tempText} ${weatherIcon} ${pressureText} ${pressureIcon}`;
    });

    return [header, "", "今日の予報:", ...forecastLines].join("\n");
  }

  /**
   * 天気予報通知の準備処理
   * データ取得、重要時間のフィルタリング、メッセージフォーマットを一括処理
   */
  async prepareWeatherNotification(
    config: WeatherNotificationConfig
  ): Promise<WeatherNotificationData | null> {
    const forecast = await weatherRetriever.getForecast(config.apiEndpoint);

    if (!forecast.placeName) {
      return null;
    }

    const importantTimes = timeFilterService.filterImportantTimes(forecast.todayForecast, {
      timezone: config.timezone,
      notificationHour: config.notificationHour,
      pressureLevelThreshold: config.pressureLevelThreshold,
    });
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
