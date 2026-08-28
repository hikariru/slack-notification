import { DateTime } from "luxon";
import { httpClient } from "../lib/httpClient";
import logger from "../lib/logger";

interface RemoEvent {
  val: number;
  created_at: string;
}

interface RemoNewestEvents {
  te: RemoEvent;
  hu: RemoEvent;
}

interface RemoDevice {
  newest_events: RemoNewestEvents;
}

interface RemoStatus {
  temperature: number;
  humidity: number;
  createdAt: string;
}

interface RemoConfig {
  apiEndpoint: string;
  token: string;
  timezone: string;
}

export class RemoRetriever {
  /**
   * 取得失敗時はnullを返す。0を実測値として扱うと閾値判定で誤警報を送るため区別する
   */
  async getCurrentStatus(remoConfig: RemoConfig): Promise<RemoStatus | null> {
    try {
      const remoDevices = await httpClient.getWithAuth<RemoDevice[]>(
        remoConfig.apiEndpoint,
        remoConfig.token
      );

      const temperature = remoDevices[0].newest_events.te;
      const humidity = remoDevices[0].newest_events.hu;
      const createdAt = DateTime.fromISO(temperature.created_at)
        .setZone(remoConfig.timezone)
        .toFormat("yyyy-MM-dd HH:mm");

      return {
        temperature: Math.round(temperature.val),
        humidity: Number(humidity.val),
        createdAt,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.warn(`Nature Remo Cloud API returned an error: ${errorMessage}`);
      return null;
    }
  }
}

export const remoRetriever = new RemoRetriever();
export type { RemoStatus };
