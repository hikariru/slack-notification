import { DateTime } from "luxon";
import { config } from "./config";
import { httpClient } from "./httpClient";
import logger from "./logger";

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

const PRESSURE_ICONS: Record<PressureLevel, string> = {
  [PressureLevel.Normal]: ":ok:",
  [PressureLevel.Stable]: ":ok:",
  [PressureLevel.Decreasing]: ":arrow_heading_down:",
  [PressureLevel.Warning]: ":warning:",
  [PressureLevel.Alert]: ":bomb:",
};

const WEATHER_ICONS: Record<WeatherType, string> = {
  [WeatherType.Sunny]: ":sunny:",
  [WeatherType.Cloudy]: ":cloud:",
  [WeatherType.Rainy]: ":umbrella:",
};

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

export const getWeatherStatus = async (): Promise<WeatherStatus> => {
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
};

export const getPressureText = (type: PressureLevel | string): string => {
  return PRESSURE_ICONS[type as PressureLevel] ?? ":innocent:";
};

export const getWeatherText = (type: WeatherType | string): string => {
  return WEATHER_ICONS[type as WeatherType] ?? ":innocent:";
};

export const filterImportantTimes = (forecast: WeatherItem[]): WeatherItem[] => {
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
};

export { WeatherStatus, type WeatherItem };
