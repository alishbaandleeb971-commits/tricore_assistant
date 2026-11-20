import { describe, it, expect, vi } from "vitest";
import { dispatchNotification, processQueueBatch } from "../src/services/dispatcher";
import { env } from "cloudflare:test";

describe("Queue Consumer & Notification Dispatcher (TASK-024)", () => {
  it("formats hot lead notification with 🔥 HOT LEAD ALERT and delivers via adapters", async () => {
    const emailSend = vi.fn().mockResolvedValue(true);
    const slackPost = vi.fn().mockResolvedValue(true);

    const payload = JSON.stringify({
      leadId: "lead-1",
      name: "Zainab Bibi",
      email: "zainab@example.com",
      service: "AI Services",
      priority: "hot",
      currency: "USD",
      source: "assistant"
    });

    const res = await dispatchNotification(
      payload,
      { emailSend, slackPost },
      { SLACK_WEBHOOK_URL: "https://hooks.slack.com/services/test" }
    );

    expect(res.status).toBe("sent");
    expect(emailSend).toHaveBeenCalledTimes(1);
    expect(emailSend.mock.calls[0][1]).toContain("🔥 HOT LEAD ALERT");
    expect(slackPost).toHaveBeenCalledTimes(1);
  });

  it("handles queue batch and marks status in D1 as delivered", async () => {
    const now = Date.now();
    await env.DB.prepare(
      `INSERT INTO notification (id, event_type, channel, dedupe_key, payload, status, attempts, created_at)
       VALUES ('notif-q1', 'lead_alert', 'email', 'dedupe-q1', ?, 'pending', 0, ?)`
    )
      .bind(JSON.stringify({ leadId: "l1", name: "Zainab", email: "z@ex.com", service: "SEO", priority: "warm", currency: "USD", source: "assistant" }), now)
      .run();

    const ack = vi.fn();
    const retry = vi.fn();

    const mockBatch = {
      messages: [
        {
          id: "msg-1",
          body: { notificationId: "notif-q1" },
          ack,
          retry
        }
      ]
    } as unknown as MessageBatch<unknown>;

    await processQueueBatch(mockBatch, env.DB, {
      emailSend: async () => true
    });

    expect(ack).toHaveBeenCalled();
    const row = await env.DB.prepare("SELECT status, attempts FROM notification WHERE id = 'notif-q1'").first<{ status: string; attempts: number }>();
    expect(row?.status).toBe("sent");
    expect(row?.attempts).toBe(1);
  });
});
