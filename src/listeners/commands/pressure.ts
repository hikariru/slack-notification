import { bolt } from "../../lib/bolt";
import logger from "../../lib/logger";
import { weatherRetriever } from "../../services/WeatherRetriever";
import { pressureMessageFormatter } from "../../services/PressureMessageFormatter";

export default () => {
  bolt.command("/pressure", async ({ ack, respond }) => {
    try {
      await ack();

      const weatherStatus = await weatherRetriever.getWeatherStatus();
      const result = await pressureMessageFormatter.processPressureRequest(weatherStatus);

      if (!result) {
        await respond({
          text: "気圧データが見つかりません。",
          response_type: "ephemeral",
        });
        return;
      }

      const message = pressureMessageFormatter.formatPressureMessage(result.placeName, result.pressureData);

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
