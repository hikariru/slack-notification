import { beforeEach, describe, expect, it, vi } from "vitest";
import { httpClient } from "../lib/httpClient";
import { RemoRetriever } from "./RemoRetriever";

const remoConfig = {
  apiEndpoint: "https://api.nature.global/1/devices",
  token: "test-token",
  timezone: "Asia/Tokyo",
};

describe("RemoRetriever", () => {
  const remoRetriever = new RemoRetriever();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the latest temperature and humidity on success", async () => {
    vi.spyOn(httpClient, "getWithAuth").mockResolvedValue([
      {
        newest_events: {
          te: { val: 25.4, created_at: "2026-08-28T06:00:00Z" },
          hu: { val: 55, created_at: "2026-08-28T06:00:00Z" },
        },
      },
    ]);

    const status = await remoRetriever.getCurrentStatus(remoConfig);

    expect(status).toEqual({
      temperature: 25,
      humidity: 55,
      createdAt: "2026-08-28 15:00",
    });
  });

  it("returns null instead of a fake 0/0 reading when the API call fails", async () => {
    vi.spyOn(httpClient, "getWithAuth").mockRejectedValue(new Error("network error"));

    const status = await remoRetriever.getCurrentStatus(remoConfig);

    expect(status).toBeNull();
  });
});
