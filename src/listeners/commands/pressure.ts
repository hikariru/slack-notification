import { bolt } from "../../modules/bolt";
import logger from "../../modules/logger";
import { getWeatherStatus } from "../../modules/getWeatherStatus";
import { pressureService } from "../../services/PressureService";

export default () => {
  bolt.command("/pressure", async ({ ack, respond }) => {
    try {
      await ack();

      const weatherStatus = await getWeatherStatus();
      const result = await pressureService.processPressureRequest(weatherStatus);

      if (!result) {
        await respond({
          text: "気圧データが見つかりません。",
          response_type: "ephemeral",
        });
        return;
      }

      const message = pressureService.formatPressureMessage(
        result.placeName,
        result.dateTime,
        result.pressureData
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
