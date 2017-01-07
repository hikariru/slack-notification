module.exports = controller => {
  "use strict";

  controller.hears('ping', ['direct_mention', 'mention'], (bot, message) =>
    bot.reply(message, 'pong')
  );
};
