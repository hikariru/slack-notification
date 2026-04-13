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

class NightscoutStatus {
  average: number;
  latest: number;
  latestDirection: string;
  readingCount: number;
  periodStart: string;
  periodEnd: string;

  constructor(
    average?: number,
    latest?: number,
    latestDirection?: string,
    readingCount?: number,
    periodStart?: string,
    periodEnd?: string
  ) {
    this.average = average ?? 0;
    this.latest = latest ?? 0;
    this.latestDirection = latestDirection ?? "";
    this.readingCount = readingCount ?? 0;
    this.periodStart = periodStart ?? "";
    this.periodEnd = periodEnd ?? "";
  }
}

export class NightscoutRetriever {
  async getRecentStatus(): Promise<NightscoutStatus> {
    const { timezone } = config.notification;
    const now = DateTime.now().setZone(timezone);
    const oneHourAgo = now.minus({ hours: 1 });

    const url = `${config.nightscout.apiEndpoint}/api/v1/entries.json?find[date][$gte]=${oneHourAgo.toMillis()}&find[date][$lte]=${now.toMillis()}&count=1000&type=sgv`;

    try {
      const entries = await httpClient.get<NightscoutEntry[]>(url);

      if (entries.length === 0) {
        return new NightscoutStatus();
      }

      const sgvValues = entries.map((e) => e.sgv);
      const average = Math.round(sgvValues.reduce((sum, v) => sum + v, 0) / sgvValues.length);

      const latestEntry = entries.reduce((a, b) => (a.date > b.date ? a : b));

      return new NightscoutStatus(
        average,
        latestEntry.sgv,
        latestEntry.direction,
        entries.length,
        oneHourAgo.toFormat("HH:mm"),
        now.toFormat("HH:mm")
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.warn(`Nightscout API returned an error: ${errorMessage}`);
      return new NightscoutStatus();
    }
  }
}

export const nightscoutRetriever = new NightscoutRetriever();
export { NightscoutStatus };
