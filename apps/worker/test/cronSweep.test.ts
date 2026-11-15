import { describe, it, expect, vi } from "vitest";
import { runCronSweep } from "../src/services/cronSweep";
import { env } from "cloudflare:test";

describe("Every-Minute Cron Trigger Sweep (TASK-025)", () => {
  it("re-queues stuck pending outbox rows older than 2 minutes and writes job_run heartbeat", async () => {
    const threeMinutesAgo = Date.now() - 180_000;
    await env.DB.prepare(
      `INSERT INTO notification (id, event_type, channel, dedupe_key, payload, status, attempts, created_at)
       VALUES ('notif-stuck', 'lead_alert', 'email', 'dedupe-stuck', '{}', 'pending', 0, ?)`
    )
      .bind(threeMinutesAgo)
      .run();

    const send = vi.fn().mockResolvedValue(undefined);
    const mockQueue = { send } as unknown as Queue;

    const res = await runCronSweep(env.DB, mockQueue);
    expect(res.recoveredCount).toBeGreaterThanOrEqual(1);
    expect(res.heartbeatRecorded).toBe(true);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ notificationId: "notif-stuck" }));

    // Verify job_run entry
    const job = await env.DB.prepare("SELECT * FROM job_run WHERE job = 'every_minute_sweep' ORDER BY ran_at DESC LIMIT 1").first();
    expect(job).toBeDefined();
    expect(job?.status).toBe("completed");
  });
});
