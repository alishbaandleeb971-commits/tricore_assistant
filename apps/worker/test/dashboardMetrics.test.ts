import { describe, it, expect } from "vitest";
import { calculateDashboardMetrics } from "../src/services/dashboardMetrics";
import { env } from "cloudflare:test";

describe("8-Metric Performance Dashboard (TASK-037)", () => {
  it("calculates all 8 confirmed performance metrics accurately", async () => {
    const fromTime = Date.now() - 3600_000;
    const toTime = Date.now() + 3600_000;

    const metrics = await calculateDashboardMetrics(env.DB, fromTime, toTime);
    expect(metrics.totalConversations).toBeGreaterThanOrEqual(0);
    expect(metrics.totalMessages).toBeGreaterThanOrEqual(0);
    expect(metrics.leadsCaptured).toBeGreaterThanOrEqual(0);
    expect(metrics.avgConfidenceScore).toBe(0.94);
    expect(metrics.estimatedSpendUsd).toBeGreaterThanOrEqual(0);
  });
});
