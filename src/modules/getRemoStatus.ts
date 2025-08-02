import { DateTime } from 'luxon';
import logger from './logger';
import { config } from './config';
import { httpClient } from './httpClient';

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

export const getRemoStatus = async (): Promise<RemoStatus> => {
  const apiBase = config.remo.apiEndpoint;
  const token = config.remo.token;

  try {
    const json = await httpClient.getWithAuth<RemoDevice[]>(apiBase, token);

    const temperature = json[0].newest_events.te;
    const humidity = json[0].newest_events.hu;
    const timezone = config.notification.timezone;
    const createdAt = DateTime.fromISO(temperature.created_at)
      .setZone(timezone)
      .toFormat('yyyy-MM-dd HH:mm');

    return new RemoStatus(Math.round(temperature.val), Number(humidity.val), createdAt);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.warn(`Nature Remo Cloud API returned an error: ${errorMessage}`);
    return new RemoStatus();
  }
};
