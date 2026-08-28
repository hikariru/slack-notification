import { beforeEach, describe, expect, it, vi } from "vitest";
import { httpClient } from "../../lib/httpClient";
import remoStatusJob from "./remoStatus";

const postMessage = vi.fn().mockResolvedValue({ ok: true });

vi.mock("slack-web-api-client", () => ({
  SlackAPIClient: vi.fn().mockImplementation(function SlackAPIClient() {
    return { chat: { postMessage } };
  }),
}));

const env = {
  SLACK_BOT_TOKEN: "xoxb-test",
  SLACK_SIGNING_SECRET: "signing-secret",
  NATURE_REMO_TOKEN: "remo-token",
  WEATHER_CHANNEL_ID: "C_WEATHER",
};

describe("remoStatusJob", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    postMessage.mockClear();
  });

  it("does not post to Slack when the Nature Remo API fetch fails", async () => {
    vi.spyOn(httpClient, "getWithAuth").mockRejectedValue(new Error("network error"));

    await remoStatusJob(env);

    expect(postMessage).not.toHaveBeenCalled();
  });

  it("posts the reading to Slack when the fetch succeeds", async () => {
    vi.spyOn(httpClient, "getWithAuth").mockResolvedValue([
      {
        newest_events: {
          te: { val: 24, created_at: "2026-08-28T06:00:00Z" },
          hu: { val: 50, created_at: "2026-08-28T06:00:00Z" },
        },
      },
    ]);

    await remoStatusJob(env);

    expect(postMessage).toHaveBeenCalledWith(expect.objectContaining({ channel: "C_WEATHER" }));
  });
});
