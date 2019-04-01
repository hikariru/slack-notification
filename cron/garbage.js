const CronJob = require('cron').CronJob;

module.exports = bot => {
  // 火・金
  new CronJob('0 0 7 * * 2,5', () => {
    bot.say({
      text: "おはようございます :sun_with_face: 今日は 燃やすごみ の収集日です :wastebasket:",
      channel: process.env.CHANNEL_ID,
    });
  }, null, true, process.env.TIME_ZONE);

  // 月・水・木
  new CronJob('0 0 7 * * 1,3,4', () => {
    bot.say({
      text: "おはようございます :sun_with_face: 収集カレンダーをチェックしましょう :wastebasket:\n" +
        process.env.GC_CALENDAR_PDF_URL,
      channel: process.env.CHANNEL_ID,
    });
  }, null, true, process.env.TIME_ZONE);
};
