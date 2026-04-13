import { WeatherType } from "./WeatherRetriever";

const WEATHER_ICONS: Record<WeatherType, string> = {
  [WeatherType.Sunny]: ":sunny:",
  [WeatherType.Cloudy]: ":cloud:",
  [WeatherType.Rainy]: ":umbrella:",
};

export const getWeatherIcon = (type: WeatherType | string): string => {
  return WEATHER_ICONS[type as WeatherType] ?? ":innocent:";
};
