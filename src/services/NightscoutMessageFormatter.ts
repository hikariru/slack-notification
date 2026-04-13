import { config } from "../lib/config";
import type { NightscoutStatus } from "./NightscoutRetriever";

const directionMap: Record<string, string> = {
  Flat: "→",
  FortyFiveUp: "↗",
  SingleUp: "↑",
  DoubleUp: "⇈",
  FortyFiveDown: "↘",
  SingleDown: "↓",
  DoubleDown: "⇊",
  "NOT COMPUTABLE": "?",
  "RATE OUT OF RANGE": "?",
};

export class NightscoutMessageFormatter {
  formatMessage(status: NightscoutStatus): string {
    const arrow = directionMap[status.latestDirection] ?? "?";
    const { high, low } = config.nightscout.thresholds;

    const header = `:drop_of_blood: 血糖値レポート (${status.periodStart} - ${status.periodEnd})`;
    const body = `平均: ${status.average} mg/dL | 最新: ${status.latest} mg/dL ${arrow} | 読取数: ${status.readingCount}件`;

    const message = `${header}\n${body}`;

    if (status.latest < low || status.latest > high) {
      return `<!channel> ${message}`;
    }

    return message;
  }
}

export const nightscoutMessageFormatter = new NightscoutMessageFormatter();
