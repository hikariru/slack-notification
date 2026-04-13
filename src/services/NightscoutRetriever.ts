import { DateTime } from "luxon";
import { config } from "../lib/config";
import { httpClient } from "../lib/httpClient";
import logger from "../lib/logger";

interface NightscoutEntry {
  _id: string;
  sgv: number;
  date: number;
  dateString: string;
  direction: string;
  type: string;
}

interface NightscoutStatus {
  average: number;
  latest: number;
  latestDirection: string;
  readingCount: number;
  periodStart: string;
  periodEnd: string;
}

const defaultNightscoutStatus: NightscoutStatus = {
  average: 0,
  latest: 0,
  latestDirection: "",
  readingCount: 0,
  periodStart: "",
  periodEnd: "",
};

export class NightscoutRetriever {
  async getRecentStatus(): Promise<NightscoutStatus> {
    const { timezone } = config.notification;
    const now = DateTime.now().setZone(timezone);
    const periodStart = now.minus({ hours: 3 });

    const baseUrl = config.nightscout.apiEndpoint.replace(/\/+$/, "");
    const url = `${baseUrl}/api/v1/entries.json?find[date][$gte]=${periodStart.toMillis()}&find[date][$lte]=${now.toMillis()}&count=1000&type=sgv`;

    try {
      const entries = await httpClient.get<NightscoutEntry[]>(url);

      if (entries.length === 0) {
        return defaultNightscoutStatus;
      }

      const sgvValues = entries.map((e) => e.sgv);
      const average = Math.round(sgvValues.reduce((sum, v) => sum + v, 0) / sgvValues.length);

      const latestEntry = entries.reduce((a, b) => (a.date > b.date ? a : b));

      return {
        average,
        latest: latestEntry.sgv,
        latestDirection: latestEntry.direction,
        readingCount: entries.length,
        periodStart: periodStart.toFormat("HH:mm"),
        periodEnd: now.toFormat("HH:mm"),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.warn(`Nightscout API returned an error: ${errorMessage}`);
      return defaultNightscoutStatus;
    }
  }
}

export const nightscoutRetriever = new NightscoutRetriever();
export type { NightscoutStatus };
