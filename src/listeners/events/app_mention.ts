module.exports = app => {
  app.event('app_mention', async ({ event, context }) => {
    await app.client.chat.postMessage({
        token: context.botToken,
        channel: event.channel,
        text: `<@${event.user}> はーい`
      });
  });
};
