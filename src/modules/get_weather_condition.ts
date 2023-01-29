import fetch from 'node-fetch'
import moment from 'moment-timezone'
import logger from './logger'

class Forecast {
  temperature: number
  humidity: number
  createdAt: string

  constructor(temperature?: number, humidity?: number, createdAt?: string) {
    this.temperature = temperature ?? 0
    this.humidity = humidity ?? 0
    this.createdAt = createdAt ?? ''
  }
}

module.exports = async () => {
  try {
    const officeId = process.env.FORECAST_OFFICE_ID ?? ''
    const endPoint = `https://www.jma.go.jp/bosai/forecast/data/forecast/${officeId}.json`

    const fetchOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'X-Requested-With': 'XMLHttpRequest',
      },
    }
    const res = await fetch(endPoint);
    if (!res.ok) {
      logger.warn(
        `Forecast API returned a error: ${res.status}(${res.statusText})`,
      )
      return new Forecast()
    }

    const areaCode = process.env.FORECAST_AREA_CODE ?? 0

  } catch (err) {
    console.log('Weather Hack API returned a error', err);
  }
};
