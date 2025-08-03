import { WeatherType } from "./WeatherRetriever";

const WEATHER_ICONS: Record<WeatherType, string> = {
  [WeatherType.Sunny]: ":sunny:",
  [WeatherType.Cloudy]: ":cloud:",
  [WeatherType.Rainy]: ":umbrella:",
};

/**
 * 天気アイコンフォーマッター
 * 天気タイプに対応するアイコンを提供
 */
export class WeatherIconFormatter {
  /**
   * 天気タイプに対応するアイコンを取得
   */
  getWeatherText(type: WeatherType | string): string {
    return WEATHER_ICONS[type as WeatherType] ?? ":innocent:";
  }
}

export const weatherIconFormatter = new WeatherIconFormatter();
