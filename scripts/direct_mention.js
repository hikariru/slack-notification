module.exports = controller => {
  controller.hears('.+', 'direct_mention', async (bot, message) => {
    await bot.reply(message, '元気ですよー！');
  });
};
