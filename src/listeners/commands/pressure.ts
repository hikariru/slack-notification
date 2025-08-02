import { DateTime } from "luxon";
import { bolt } from "../../modules/bolt";
import { config } from "../../modules/config";
import logger from "../../modules/logger";
import {
  getWeatherStatus,
  getPressureText,
  type WeatherItem,
} from "../../modules/getWeatherStatus";

interface PressureData {
  time: string;
  pressure: string;
  pressureLevel: string;
  timestamp: DateTime;
}

const findClosestPressureData = (forecast: WeatherItem[]): PressureData | null => {
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
};

const formatPressureMessage = (
  placeName: string,
  dateTime: string,
  pressureData: PressureData
): string => {
  const header = `📍 ${placeName} (${dateTime})`;
  const timeText = `${pressureData.time}時`;
  const pressureText = `${pressureData.pressure}hPa`;
  const pressureIcon = getPressureText(pressureData.pressureLevel);

  return [header, "", "現在の気圧:", `${timeText}: ${pressureText} ${pressureIcon}`].join("\n");
};

export default () => {
  bolt.command("/pressure", async ({ ack, respond }) => {
    try {
      await ack();

      const weatherStatus = await getWeatherStatus();

      if (!weatherStatus.placeName) {
        await respond({
          text: "気圧データが見つかりません。",
          response_type: "ephemeral",
        });
        return;
      }

      const pressureData = findClosestPressureData(weatherStatus.todayForecast);

      if (!pressureData) {
        await respond({
          text: "現在の気圧データが見つかりません。",
          response_type: "ephemeral",
        });
        return;
      }

      const message = formatPressureMessage(
        weatherStatus.placeName,
        weatherStatus.dateTime,
        pressureData
      );

      await respond({
        text: message,
        response_type: "ephemeral",
      });
    } catch (error) {
      logger.error("Pressure command failed:", error);

      await respond({
        text: "気圧情報の取得に失敗しました。しばらく時間をおいて再度お試しください。",
        response_type: "ephemeral",
      });
    }
  });
};
