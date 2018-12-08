const CronJob = require('cron').CronJob;

module.exports = bot => {
  new CronJob('0 0 9 * * 2', () => {
    bot.say({
      text: `火曜日だぁああ！！ :ice_cream: \n https://mognavi.jp/do/whats_new/show :custard:`,
      channel: process.env.CHANNEL_ID,
    });
  }, null, true, process.env.TIME_ZONE);
};
