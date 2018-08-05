const CronJob = require('cron').CronJob;
const TimeDate = require('time').Date;

module.exports = bot => {
  new CronJob('0 0 21 * * *', () => {
    bot.say({
      text: `こんばんは :full_moon_with_face: 夜のお薬は飲みましたか :pill:`,
      channel: process.env.CHANNEL_ID,
    });
  }, null, true, process.env.TIME_ZONE);
};
