import { describe, expect, it } from "vitest";
import { resolveScheduledJob } from "./resolveScheduledJob";

describe("resolveScheduledJob", () => {
  it("maps the room-status cron expression to remoStatus", () => {
    expect(resolveScheduledJob("0 */3 * * *")).toBe("remoStatus");
  });

  it("maps the weather cron expression to weatherStatus", () => {
    expect(resolveScheduledJob("0 21 * * *")).toBe("weatherStatus");
  });

  it("returns null for an unrecognized cron expression", () => {
    expect(resolveScheduledJob("*/5 * * * *")).toBeNull();
  });
});
