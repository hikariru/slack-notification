const CronJob = require('cron').CronJob;
const TimeDate = require('time').Date;

/** @type {Array} */
const garbageList = require('../constants/garbage.json');

/**
 * @return {string}
 */
const resolveGarbageType = () => {
  const date = new TimeDate();
  date.setTimezone(process.env.TIME_ZONE);
  const day = date.getDay();

  return garbageList[day];
};

module.exports = bot => {
  new CronJob('0 0 7 * * 1-5', () => {
    bot.say({
      text: `おはようございます :sun_with_face: 今日は *${resolveGarbageType()}* の収集日です :wastebasket:`,
      channel: process.env.CHANNEL_ID,
    });
  }, null, true, process.env.TIME_ZONE);
};
