module.exports = controller => {
  controller.on('slash_command', async (bot, message) => {
    bot.botkit.log(`received slash_command: ${message.command} with token ${message.token}`);
    switch (message.command) {
      default:
        if (message.token !== process.env.VERIFICATION_TOKEN) return;
        await bot.replyPublic(message, `I'm afraid I don't know how to ${message.command} yet.`);
    }
  });
};
