module.exports = app => {
  app.event('app_mention', async ({ event, context }) => {
    console.log(event);
    await app.client.chat.postMessage({
        token: context.botToken,
        channel: event.channel,
        text: `<@${event.user.id}> はーい`
      });
  });
};
