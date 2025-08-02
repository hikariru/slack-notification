import type express from 'express';
import { DateTime } from 'luxon';
import { config } from './config';

/**
 * Creates a middleware that checks if the current hour meets specific time conditions
 *
 * @param type - The type of check to perform: 'interval' or 'specificHour'
 * @param options - Configuration options for the time check
 * @returns Express middleware function
 */
export const createTimeCheckMiddleware = (
  type: 'interval' | 'specificHour',
  options?: {
    hourInterval?: number;
    specificHour?: number;
    timezone?: string;
  }
) => {
  return async (_req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Send 202 Accepted status immediately
    res.sendStatus(202);

    // Get timezone from options or config
    const timezone = options?.timezone || config.notification.timezone;
    const currentHour = Number(DateTime.now().setZone(timezone).hour);

    let shouldContinue = false;

    if (type === 'interval') {
      const hourInterval = options?.hourInterval || config.notification.remoStatus.hourInterval;
      shouldContinue = currentHour % hourInterval === 0;
    } else if (type === 'specificHour') {
      const specificHour = options?.specificHour || config.weather.notificationHour;
      shouldContinue = currentHour === specificHour;
    }

    if (shouldContinue) {
      await next();
    }
  };
};
