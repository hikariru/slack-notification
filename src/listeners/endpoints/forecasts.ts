import express from 'express'
import moment from 'moment-timezone'
import {receiver} from "../../modules/receiver";
import {bolt} from "../../modules/bolt";

module.exports = () => {
  receiver.router.get(
    '/slack/forecast',
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      res.sendStatus(202)

      const timezone = process.env.TIMEZONE ?? ''
      const currentHour = Number(moment().tz(timezone).hour())

      if (currentHour % 4 !== 0) {
        return
      }

      await next()
    },
  )

  receiver.router.get(`/slack/forecast`, async () => {
    const reports = await getWeatherReports();
    const attachments = buildForecastMessages(reports);

    const weatherChannelId = process.env.WEATHER_CHANNEL_ID ?? ''
    return bolt.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: weatherChannelId,
      text: `${reports.title} をお知らせします！`,
      attachments: attachments
    })
  })
};
