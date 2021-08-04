import { bolt } from "../../modules/bolt";

module.exports = () => {
  bolt.event('app_mention', async ({ event, context }) => {
    const user = event.user ?? '';
    await bolt.client.chat.postMessage({
        token: context.botToken,
        channel: event.channel,
        text: `<@${user}> はーい`
      });
  });
};
