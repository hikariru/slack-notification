module.exports = function(controller) {
  controller.hears('hello', ['direct_mention', 'mention'], (bot, message) =>
    bot.reply(message, 'hello')
  );
};