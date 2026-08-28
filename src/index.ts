import { SlackApp, type SlackEdgeAppEnv } from "slack-cloudflare-workers";
import type { Env } from "./lib/config";
import logger from "./lib/logger";
import appMentionEvent from "./listeners/events/app_mention";
import pingCommand from "./listeners/commands/ping";
import remoStatusJob from "./listeners/scheduled/remoStatus";
import { resolveScheduledJob } from "./listeners/scheduled/resolveScheduledJob";
import weatherStatusJob from "./listeners/scheduled/weatherStatus";

export default {
  async fetch(request: Request, env: SlackEdgeAppEnv, ctx: ExecutionContext): Promise<Response> {
    const app = new SlackApp({ env });
    pingCommand(app);
    appMentionEvent(app);
    return await app.run(request, ctx);
  },

  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    const job = resolveScheduledJob(controller.cron);
    if (job === "remoStatus") {
      ctx.waitUntil(remoStatusJob(env));
    } else if (job === "weatherStatus") {
      ctx.waitUntil(weatherStatusJob(env));
    } else {
      logger.warn(`Unrecognized cron expression: ${controller.cron}`);
    }
  },
};
