module.exports = controller => {
  controller.hears('.+', 'direct_mention', (bot, message) => {
    bot.reply(message, '元気ですよー！');
  });
};