module.exports = controller => {
  controller.on('channel_created', (bot, message) => {
    bot.api.channels.list({}, (error, response) => {
      if (!response.hasOwnProperty('channels') || !response.ok || error) {
        return;
      }

      bot.say({
        text: `新しいチャンネルができたみたいです :tv: #${message.channel.name}`,
        channel: process.env.CHANNEL_ID,
      });
    });
  });
};
