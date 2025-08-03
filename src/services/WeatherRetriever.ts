import { config } from "../lib/config";
import { httpClient } from "../lib/httpClient";
import logger from "../lib/logger";

export enum PressureLevel {
  Normal = "0",
  Stable = "1",
  Decreasing = "2",
  Warning = "3",
  Alert = "4",
}

export enum WeatherType {
  Sunny = "100",
  Cloudy = "200",
  Rainy = "300",
}

const getApiEndpoint = (): string => {
  return `${config.weather.zutoolApiEndpoint}/${config.weather.defaultAreaId}`;
};

interface WeatherApiResponse {
  place_name: string;
  place_id: string;
  prefectures_id: string;
  dateTime: string;
  yesterday: WeatherDataItem[];
  today: WeatherDataItem[];
  tomorrow: WeatherDataItem[];
  day_after_tomorrow: WeatherDataItem[];
}

interface WeatherDataItem {
  time: string;
  weather: string;
  temp: string;
  pressure: string;
  pressure_level: string;
}

interface WeatherItem {
  time: string;
  weather: WeatherType | string;
  temp: string;
  pressure: string;
  pressureLevel: PressureLevel | string;
}

class WeatherStatus {
  placeName: string;
  dateTime: string;
  todayForecast: WeatherItem[];

  constructor(placeName?: string, dateTime?: string, todayForecast?: WeatherItem[]) {
    this.placeName = placeName ?? "";
    this.dateTime = dateTime ?? "";
    this.todayForecast = todayForecast ?? [];
  }
}

/**
 * 天気データ取得サービス
 * 天気予報APIからのデータ取得と基本的な処理を担当
 */
export class WeatherRetriever {
  /**
   * 天気予報データを取得
   */
  async getWeatherStatus(): Promise<WeatherStatus> {
    try {
      const json = await httpClient.get<WeatherApiResponse>(getApiEndpoint());

      const todayForecast = json.today.map((item) => ({
        time: item.time,
        weather: item.weather,
        temp: item.temp,
        pressure: item.pressure,
        pressureLevel: item.pressure_level,
      }));

      return new WeatherStatus(json.place_name, json.dateTime, todayForecast);
    } catch (error) {
      logger.error("Failed to fetch weather status:", error);
      return new WeatherStatus();
    }
  }
}

export const weatherRetriever = new WeatherRetriever();
export { WeatherStatus, type WeatherItem };
