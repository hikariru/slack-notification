import { DateTime } from 'luxon';
import logger from './logger';
import { config } from './config';
import { httpClient } from './httpClient';

const PRESSURE_ICONS: Record<string, string> = {
  '0': ':ok:',
  '1': ':ok:',
  '2': ':arrow_heading_down:',
  '3': ':warning:',
  '4': ':bomb:',
};

const WEATHER_ICONS: Record<string, string> = {
  '100': ':sunny:',
  '200': ':cloud:',
  '300': ':umbrella:',
};

const getApiEndpoint = (): string => {
  return `${config.weather.apiEndpoint}/${config.weather.defaultAreaId}`;
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
  weather: string;
  temp: string;
  pressure: string;
  pressureLevel: string;
}

class WeatherStatus {
  placeName: string;
  dateTime: string;
  todayForecast: WeatherItem[];

  constructor(
    placeName?: string,
    dateTime?: string,
    todayForecast?: WeatherItem[],
  ) {
    this.placeName = placeName ?? '';
    this.dateTime = dateTime ?? '';
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
    logger.error('Failed to fetch weather status:', error);
    return new WeatherStatus();
  }
};

export const getPressureText = (type: string): string => {
  return PRESSURE_ICONS[type] ?? ':innocent:';
};

export const getWeatherText = (type: string): string => {
  return WEATHER_ICONS[type] ?? ':innocent:';
};

export const filterImportantTimes = (
  forecast: WeatherItem[],
): WeatherItem[] => {
  const currentHour = DateTime.now().setZone(config.notification.timezone).hour;

  return forecast.filter((item) => {
    const itemHour = parseInt(item.time);

    if (currentHour === config.weather.notificationHour) {
      return itemHour >= config.weather.notificationHour;
    }

    if (itemHour <= currentHour) return false;

    if (parseInt(item.pressureLevel) >= 2) return true;

    return (itemHour - currentHour) % 6 === 0;
  });
};

export { WeatherStatus, WeatherItem };
