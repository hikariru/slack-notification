const CronJob = require('cron').CronJob;
const TimeDate = require('time').Date;

const garbageList = require('../data/garbage.json');

const TIME_ZONE = 'Asia/Tokyo';

const garbageType = () => {
  "use strict";

  const date = new TimeDate();
  date.setTimezone(TIME_ZONE);
  const day = date.getDay();

  return garbageList[day];
};

module.exports = bot => {
  "use strict";

  new CronJob('0 0 7 * * 1-5', () => {
    bot.say({
      text: 'おはようございます。今日は「'+ garbageType() + '」の収集日です。',
      channel: process.env.CHANNEL_ID
    });
  }, null, true, TIME_ZONE);
};
