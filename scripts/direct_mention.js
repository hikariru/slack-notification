module.exports = controller => {
  controller.hears(new RegExp('.+'), 'direct_mention', async (bot, message) => {
    await bot.reply(message, '元気ですよー！');
  });
};
