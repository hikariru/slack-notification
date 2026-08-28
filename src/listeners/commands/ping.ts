import type { SlackApp, SlackEdgeAppEnv } from "slack-cloudflare-workers";

export default (app: SlackApp<SlackEdgeAppEnv>) => {
  app.command("/ping", async () => "pong!");
};
