const request = require('request');

const DIALOG_API_URL = 'https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue';

module.exports = controller => {
  controller.hears('.+', ['direct_message', 'direct_mention'], (bot, message) => {
    bot.api.users.info({
      user: message.user
    }, (error, response) => {
      if (error) {
        bot.botkit.log('Failed to get user info :(', error);
        return;
      }

      const payload = {
        utt: message.text,
        nickname: response.user.name
      };

      request.post({
        url: DIALOG_API_URL,
        qs: {
          APIKEY: process.env.DIALOGUE_API_KEY,
        },
        json: payload,
      }, (error, response, body) => {
        if (error || response.statusCode !== 200) {
          bot.botkit.log('Failed to access dialogue API :(', error);
          return;
        }

        bot.reply(message, body.utt);
      });
    });
  });
};
