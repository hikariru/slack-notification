import fetch from "node-fetch";
import moment from "moment-timezone";
import logger from "./logger";

class RemoStatus {
  temperature: number;
  humidity: number;
  createdAt: string;

  constructor(temperature?: number, humidity?: number, createdAt?: string) {
    this.temperature = temperature ?? 0;
    this.humidity = humidity ?? 0;
    this.createdAt = createdAt ?? '';
  }
}

export const getRemoStatus = async(): Promise<RemoStatus> => {
  const remoToken = process.env.NATURE_REMO_TOKEN ?? '';
  const apiBase = 'https://api.nature.global:443';
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${remoToken}`,
      'Cache-Control': 'no-cache',
      'X-Requested-With': 'XMLHttpRequest',
    },
  };

  const res = await fetch(apiBase+ '/1/devices', fetchOptions);

  if (!res.ok) {
    logger.warn(`Nature Remo Cloud API returned a error: ${res.status}(${res.statusText})`);
    return new RemoStatus();
  }

  const json = await res.json();
  const temperature = json[0].newest_events.te;
  const humidity = json[0].newest_events.hu;
  const timezone = process.env.TIMEZONE ?? '';
  const createdAt = moment(temperature.created_at).tz(timezone).format('YYYY-MM-DD HH:mm');
  return new RemoStatus(Math.round(temperature.val), Number(humidity.val), createdAt);
};
