import type { SlackApp, SlackEdgeAppEnv } from "slack-cloudflare-workers";

export default (app: SlackApp<SlackEdgeAppEnv>) => {
  app.event("app_mention", async ({ context, payload }) => {
    const user = payload.user ?? "";
    await context.say({ text: `<@${user}> はーい` });
  });
};
