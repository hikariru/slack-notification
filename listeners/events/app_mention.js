module.exports = app => {
  app.event('app_mention', async ({ event, context }) => {
    try {
      const result = await app.client.chat.postMessage({
        token: context.botToken,
        text: `<@${event.user.id}> はーい`
      });
      console.log(result);
    }
    catch (error) {
      console.error(error);
    }
  });
};
