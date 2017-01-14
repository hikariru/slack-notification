const request = require('request');

const DIALOG_API_URL = 'https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue';
const CONTEXT_TTL = 1 * 60 * 1000;
const STORAGE_KEY = 'dialog_context';

const buildPayload = (message, response, userData) => {
  const payload = {
    utt: message.text,
    nickname: response.user.name,
    place: process.env.DIALOGUE_PLACE
  };

  if (!userData) {
      return payload;
  }

  if (userData.expiredAt <= new Date().getTime()) {
    return payload;
  }

  payload.context = userData.lastContext;

  return payload;
};

module.exports = controller => {
  controller.hears('.+', ['direct_mention'], (bot, message) => {
    bot.api.users.info({
      user: message.user
    }, (error, response) => {
      if (error) {
        bot.botkit.log('Failed to get user info :(', error);
        return;
      }

      controller.storage.users.get(STORAGE_KEY, (error, userData) => {
        if (error) {
          bot.botkit.log('Failed to get user data :(', error);
          return;
        }
        console.log(buildPayload(message, response, userData));
        request.post({
          url: DIALOG_API_URL,
          qs: {
            APIKEY: process.env.DIALOGUE_API_KEY,
          },
          json: buildPayload(message, response, userData),
        }, (error, response, body) => {
          if (error || response.statusCode !== 200) {
            bot.botkit.log('Failed to access dialogue API :(', error);
            return;
          }

          const contextData = {
            id: STORAGE_KEY,
            lastContext: body.context,
            expiredAt: new Date().getTime() + CONTEXT_TTL
          };
          controller.storage.users.save(contextData, () => {
            bot.reply(message, body.utt);
          });
        });
      });
    });
  });
};
