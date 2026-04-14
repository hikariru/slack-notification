import { config } from "../lib/config";
import type { NightscoutStatus } from "./NightscoutRetriever";

const directionMap: Record<string, string> = {
  Flat: "➡️",
  FortyFiveUp: "↗️",
  SingleUp: "⬆️",
  DoubleUp: "⏫",
  FortyFiveDown: "↘️",
  SingleDown: "⬇️",
  DoubleDown: "⏬",
  "NOT COMPUTABLE": "❓",
  "RATE OUT OF RANGE": "❓",
};

export class NightscoutMessageFormatter {
  formatMessage(status: NightscoutStatus): string {
    const arrow = directionMap[status.latestDirection] ?? "❓";
    const { high, low } = config.nightscout.thresholds;

    const message = `:drop_of_blood: ${status.latest} mg/dL ${arrow} (${status.periodStart} - ${status.periodEnd})`;

    const isAlert = status.latest < low || status.latest > high;

    if (isAlert && status.wasAlertOneHourAgo) {
      return `:rotating_light: ${message}`;
    }
    if (isAlert) {
      return `<!channel> :rotating_light: ${message}`;
    }

    return message;
  }
}

export const nightscoutMessageFormatter = new NightscoutMessageFormatter();
