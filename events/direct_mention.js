module.exports = controller => {
  controller.on('direct_mention', async (bot, message) => {
    await bot.reply(message, 'はーい');
  });
};
