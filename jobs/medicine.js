const CronJob = require('cron').CronJob;

module.exports = bot => {
  new CronJob('0 0 9 * * *', () => {
    bot.say({
      text: `おはようございます :sun_with_face: 朝のお薬は飲みましたか :pill:`,
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
