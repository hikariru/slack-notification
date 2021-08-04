import { App } from "../../modules/bolt";

module.exports = () => {
  App.event('app_mention', async ({ event, context }) => {
    const user = event.user ?? '';
    await App.client.chat.postMessage({
        token: context.botToken,
        channel: event.channel,
        text: `<@${user}> はーい`
      });
  });
};
