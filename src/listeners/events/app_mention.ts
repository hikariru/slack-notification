import { bolt } from "../../lib/bolt";

export default () => {
  bolt.event("app_mention", async ({ event, context }) => {
    const user = event.user ?? "";
    await bolt.client.chat.postMessage({
      token: context.botToken,
      channel: event.channel,
      text: `<@${user}> はーい`,
    });
  });
};
