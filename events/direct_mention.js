module.exports = controller => {
  controller.on('app_mention', async (bot, message) => {
    await bot.reply(message, 'はーい');
  });
};
