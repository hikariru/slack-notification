const CronJob = require('cron').CronJob;

module.exports = bot => {
  new CronJob('0 0 9 * * 2', () => {
    bot.say({
      text: `やったぁあああ！火曜日だぁああ！！:ice_cream::custard:\n https://mognavi.jp/do/whats_new/show`,
      channel: process.env.CHANNEL_ID,
    });
  }, null, true, process.env.TIME_ZONE);
};
