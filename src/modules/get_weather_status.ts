import { DateTime } from 'luxon';
import logger from './logger';

const getApiEndpoint = (): string => {
  const areaId = process.env.FORECAST_AREA_ID ?? '13101';
  return `https://zutool.jp/api/getweatherstatus/${areaId}`;
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
  const fetchOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'X-Requested-With': 'XMLHttpRequest',
    },
  };

  try {
    const res = await fetch(getApiEndpoint(), fetchOptions);

    if (!res.ok) {
      logger.warn(
        `Weather API returned an error: ${res.status}(${res.statusText})`,
      );
      return new WeatherStatus();
    }

    const json: WeatherApiResponse = await res.json();

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
  if (type === '0') return ':ok:';
  if (type === '1') return ':ok:';
  if (type === '2') return ':arrow_heading_down:';
  if (type === '3') return ':warning:';
  if (type === '4') return ':bomb:';
  return ':innocent:';
};

export const getWeatherText = (type: string): string => {
  if (type === '100') return ':sunny:';
  if (type === '200') return ':cloud:';
  if (type === '300') return ':umbrella:';
  return ':innocent:';
};

export const filterImportantTimes = (
  forecast: WeatherItem[],
): WeatherItem[] => {
  const timezone = process.env.TIMEZONE ?? 'Asia/Tokyo';
  const currentHour = DateTime.now().setZone(timezone).hour;

  return forecast.filter((item) => {
    const itemHour = parseInt(item.time);

    if (currentHour === 7) {
      return itemHour >= 7;
    }

    if (itemHour <= currentHour) return false;

    if (parseInt(item.pressureLevel) >= 2) return true;

    return (itemHour - currentHour) % 6 === 0;
  });
};

export { WeatherStatus };
