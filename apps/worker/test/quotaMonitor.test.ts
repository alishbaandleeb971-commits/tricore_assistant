import { describe, it, expect } from "vitest";
import { captureHourlyQuotaSnapshot } from "../src/services/quotaMonitor";
import { env } from "cloudflare:test";

describe("CPU Budget & Free-Tier Quota Monitor (TASK-052)", () => {
  it("records hourly usage snapshot and triggers warning alert when usage >= 60% of cap", async () => {
    // 1. Under 60%
    const res1 = await captureHourlyQuotaSnapshot(env.DB, "workers_requests", 40000, 100000);
    expect(res1.warningNeeded).toBe(false);

    // 2. Over 60% of daily limit
    const res2 = await captureHourlyQuotaSnapshot(env.DB, "workers_requests", 65000, 100000);
    expect(res2.warningNeeded).toBe(true);

    // Check row in D1
    const row = await env.DB.prepare("SELECT * FROM usage_snapshot WHERE id = ?").bind(res2.snapshotId).first();
    expect(row?.metric).toBe("workers_requests");
    expect(row?.value).toBe(65000);
  });
});
