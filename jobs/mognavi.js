const CronJob = require('cron').CronJob;

/**@type {string} */
const mogNaviURL = 'https://mognavi.jp/do/whats_new/show';

module.exports = bot => {
  new CronJob('0 0 9 * * 2', () => {
    bot.say({
      text: `やったぁあああ！火曜日だぁああ！！:ice_cream::custard:\n ${mogNaviURL}`,
      channel: process.env.CHANNEL_ID,
    });
  }, null, true, process.env.TIME_ZONE);
};
