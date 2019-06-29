const CronJob = require('cron').CronJob;

module.exports = bot => {
  // 月
  new CronJob('0 0 7 * * 1', () => {
    bot.say({
      text: "おはようございます :sun_with_face: 今日は もやせるごみ の収集日です :wastebasket:",
      channel: process.env.CHANNEL_ID,
    });
  }, null, true, process.env.TIME_ZONE);

  // 水
  new CronJob('0 0 7 * * 3', () => {
    bot.say({
      text: "おはようございます :sun_with_face: 今日は 資源プラスチック の収集日です :wastebasket:",
      channel: process.env.CHANNEL_ID,
    });
  }, null, true, process.env.TIME_ZONE);

  // 火・木・金
  new CronJob('0 0 7 * * 2,4,5', () => {
    bot.say({
      text: "おはようございます :sun_with_face: 収集カレンダーをチェックしましょう :wastebasket:\n" +
        process.env.GC_CALENDAR_PDF_URL,
      channel: process.env.CHANNEL_ID,
    });
  }, null, true, process.env.TIME_ZONE);
};
