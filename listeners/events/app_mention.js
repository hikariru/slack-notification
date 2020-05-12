const { AppMentionEvent } = require('@slack/bolt')

module.exports = app => {
  app.event(AppMentionEvent.type, async ({ event, context }) => {
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
