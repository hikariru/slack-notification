module.exports = controller => {
  controller.on('channel_created', (bot, message) => {
    bot.api.channels.list({}, (error, response) => {
      if (!response.hasOwnProperty('channels') || !response.ok || error) {
        return;
      }

      const payload = {
        'link_names': 1,
        'parse': 'full',
        'text': `新しいチャンネルができたみたいです :tv: #${message.channel.name}`,
      };

      bot.reply({ 'channel': process.env.CHANNEL_ID, }, payload);
    });
  });
};
