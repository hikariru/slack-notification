import { DateTime } from "luxon";
import { config } from "../lib/config";
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

const defaultRemoStatus: RemoStatus = { temperature: 0, humidity: 0, createdAt: "" };

export class RemoRetriever {
  async getCurrentStatus(): Promise<RemoStatus> {
    const apiBase = config.remo.apiEndpoint;
    const token = config.remo.token;

    try {
      const remoDevices = await httpClient.getWithAuth<RemoDevice[]>(apiBase, token);

      const temperature = remoDevices[0].newest_events.te;
      const humidity = remoDevices[0].newest_events.hu;
      const createdAt = DateTime.fromISO(temperature.created_at)
        .setZone(config.notification.timezone)
        .toFormat("yyyy-MM-dd HH:mm");

      return {
        temperature: Math.round(temperature.val),
        humidity: Number(humidity.val),
        createdAt,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.warn(`Nature Remo Cloud API returned an error: ${errorMessage}`);
      return defaultRemoStatus;
    }
  }
}

export const remoRetriever = new RemoRetriever();
export type { RemoStatus };
