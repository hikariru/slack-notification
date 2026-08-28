export type ScheduledJobName = "remoStatus" | "weatherStatus";

// wrangler.jsonc の triggers.crons と対応させる
export const resolveScheduledJob = (cron: string): ScheduledJobName | null => {
  if (cron === "0 */3 * * *") return "remoStatus";
  if (cron === "0 21 * * *") return "weatherStatus";
  return null;
};
