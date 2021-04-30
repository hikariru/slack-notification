import {App, ExpressReceiver} from '@slack/bolt';

module.exports = (app: App, receiver: ExpressReceiver) => {
  app.event('app_mention', async ({ event, context }) => {
    await app.client.chat.postMessage({
        token: context.botToken,
        channel: event.channel,
        text: `<@${event.user}> はーい`
      });
  });
};
