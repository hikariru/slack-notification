const CronJob = require('cron').CronJob;
const TimeDate = require('time').Date;

module.exports = bot => {
  new CronJob('0 0 9 * * *', () => {
    bot.say({
      text: `おはようございます :sunrise: 朝のお薬は飲みましたか :pill:`,
      channel: process.env.CHANNEL_ID,
    });
  }, null, true, process.env.TIME_ZONE);
  new CronJob('0 0 13 * * *', () => {
    bot.say({
      text: `こんにちは :sun_with_face: 昼のお薬は飲みましたか :pill:`,
      channel: process.env.CHANNEL_ID,
    });
  }, null, true, process.env.TIME_ZONE);
  new CronJob('0 0 21 * * *', () => {
    bot.say({
      text: `こんばんは :full_moon_with_face: 夜のお薬は飲みましたか :pill:`,
      channel: process.env.CHANNEL_ID,
    });
  }, null, true, process.env.TIME_ZONE);
};
