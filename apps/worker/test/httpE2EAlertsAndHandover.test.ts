import { describe, it, expect, vi, beforeEach } from "vitest";
import app from "../src/index.js";
import { env } from "cloudflare:test";
import { processQueueBatch, clearCapturedDispatches } from "../src/services/dispatcher.js";
import { runCronSweep } from "../src/services/cronSweep.js";

describe("Stage G3 Queue Consumer, Outbox Lifecycle & Handover Alert Integration Tests", () => {
  beforeEach(() => {
    clearCapturedDispatches();
  });

  it("1. Full lead flow -> 2 outbox rows (email + slack) -> queue consumer processes both -> both marked sent with attempts=1", async () => {
    // A. Init session
    const initRes = await app.fetch(
      new Request("http://localhost/api/v1/public/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: "turnstile-alerts-flow" })
      }),
      env
    );
    const { sessionId } = (await initRes.json()) as { sessionId: string };

    const sendMsg = async (text: string) => {
      const res = await app.fetch(
        new Request(`http://localhost/api/v1/public/sessions/${sessionId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        }),
        env
      );
      return (await res.json()) as { reply: string; stage: string; leadId?: string };
    };

    // Run deterministic lead script
    await sendMsg("I want a quote");
    await sendMsg("agree");
    await sendMsg("Alishba");
    await sendMsg("alishba@example.com");
    await sendMsg("ai-services");
    await sendMsg("skip"); // phone
    await sendMsg("USD");
    await sendMsg("skip"); // description
    const confirmRes = await sendMsg("confirm");

    expect(confirmRes.stage).toBe("Chatting");
    expect(confirmRes.leadId).toBeDefined();

    // Verify 2 notification outbox rows exist in D1 (email + slack), initially pending with attempts=0
    const outboxRows = await env.DB.prepare(
      "SELECT id, channel, status, attempts, dedupe_key, payload FROM notification WHERE payload LIKE ? ORDER BY channel ASC"
    )
      .bind(`%${confirmRes.leadId}%`)
      .all<{ id: string; channel: string; status: string; attempts: number; dedupe_key: string; payload: string }>();

    expect(outboxRows.results.length).toBe(2);
    const emailRow = outboxRows.results.find((r) => r.channel === "email");
    const slackRow = outboxRows.results.find((r) => r.channel === "slack");

    expect(emailRow).toBeDefined();
    expect(emailRow?.status).toBe("pending");
    expect(emailRow?.attempts).toBe(0);
    expect(emailRow?.dedupe_key).toBe(`lead:${confirmRes.leadId}:v1:email`);

    expect(slackRow).toBeDefined();
    expect(slackRow?.status).toBe("pending");
    expect(slackRow?.attempts).toBe(0);
    expect(slackRow?.dedupe_key).toBe(`lead:${confirmRes.leadId}:v1:slack`);

    // Verify payload content format
    const parsedPayload = JSON.parse(emailRow!.payload);
    expect(parsedPayload.name).toBe("Alishba");
    expect(parsedPayload.email).toBe("alishba@example.com");
    expect(parsedPayload.service).toBe("ai-services");

    // Process both messages through queue consumer
    const ack1 = vi.fn();
    const ack2 = vi.fn();
    const mockBatch = {
      messages: [
        { id: "m-1", body: { notificationId: emailRow!.id }, ack: ack1, retry: vi.fn() },
        { id: "m-2", body: { notificationId: slackRow!.id }, ack: ack2, retry: vi.fn() }
      ]
    } as unknown as MessageBatch<unknown>;

    await processQueueBatch(mockBatch, env.DB);

    expect(ack1).toHaveBeenCalled();
    expect(ack2).toHaveBeenCalled();

    // Verify both rows updated in D1: status = 'sent' and attempts = 1
    const emailUpdated = await env.DB.prepare("SELECT status, attempts FROM notification WHERE id = ?")
      .bind(emailRow!.id)
      .first<{ status: string; attempts: number }>();
    expect(emailUpdated?.status).toBe("sent");
    expect(emailUpdated?.attempts).toBe(1);

    const slackUpdated = await env.DB.prepare("SELECT status, attempts FROM notification WHERE id = ?")
      .bind(slackRow!.id)
      .first<{ status: string; attempts: number }>();
    expect(slackUpdated?.status).toBe("sent");
    expect(slackUpdated?.attempts).toBe(1);
  });

  it("2. Adapter failure -> retried, stays pending with incremented attempts, then undeliverable after max attempts", async () => {
    const now = Date.now();
    const notifId = "notif-fail-test";
    await env.DB.prepare(
      `INSERT INTO notification (id, event_type, channel, dedupe_key, payload, status, attempts, created_at)
       VALUES (?, 'lead_alert', 'email', 'dedupe-fail-test', ?, 'pending', 0, ?)`
    )
      .bind(
        notifId,
        JSON.stringify({ leadId: "fail-l1", name: "Tester", email: "t@ex.com", service: "SEO", priority: "warm", currency: "USD", source: "widget" }),
        now
      )
      .run();

    // First failure attempt (attempts -> 1, status -> pending, msg.retry called)
    const retry1 = vi.fn();
    await processQueueBatch(
      {
        messages: [{ id: "m-f1", body: { notificationId: notifId }, ack: vi.fn(), retry: retry1 }]
      } as unknown as MessageBatch<unknown>,
      env.DB,
      { emailSend: async () => false } // simulated adapter failure
    );

    expect(retry1).toHaveBeenCalled();
    let row = await env.DB.prepare("SELECT status, attempts FROM notification WHERE id = ?").bind(notifId).first<{ status: string; attempts: number }>();
    expect(row?.status).toBe("pending");
    expect(row?.attempts).toBe(1);

    // Simulate 4 more failures (reaching attempts = 5)
    for (let i = 2; i <= 5; i++) {
      const ack = vi.fn();
      const retry = vi.fn();
      await processQueueBatch(
        {
          messages: [{ id: `m-f${i}`, body: { notificationId: notifId }, ack, retry }]
        } as unknown as MessageBatch<unknown>,
        env.DB,
        { emailSend: async () => false }
      );
      if (i === 5) {
        expect(ack).toHaveBeenCalled(); // 5th failure is marked undeliverable and message acked
      }
    }

    row = await env.DB.prepare("SELECT status, attempts FROM notification WHERE id = ?").bind(notifId).first<{ status: string; attempts: number }>();
    expect(row?.status).toBe("undeliverable");
    expect(row?.attempts).toBe(5);
  });

  it("3. Duplicate queue delivery sends nothing twice (idempotency via conditional update)", async () => {
    const now = Date.now();
    const notifId = "notif-dupe-test";
    await env.DB.prepare(
      `INSERT INTO notification (id, event_type, channel, dedupe_key, payload, status, attempts, created_at)
       VALUES (?, 'lead_alert', 'email', 'dedupe-dupe-test', ?, 'sent', 1, ?)`
    )
      .bind(
        notifId,
        JSON.stringify({ leadId: "dupe-l1", name: "Dupe", email: "d@ex.com", service: "SEO", priority: "warm", currency: "USD", source: "widget" }),
        now
      )
      .run();

    const mockEmailSend = vi.fn().mockResolvedValue(true);
    const ack = vi.fn();
    await processQueueBatch(
      {
        messages: [{ id: "m-dupe", body: { notificationId: notifId }, ack, retry: vi.fn() }]
      } as unknown as MessageBatch<unknown>,
      env.DB,
      { emailSend: mockEmailSend }
    );

    // Because row was already 'sent', consumer acknowledged duplicate and sent 0 emails
    expect(ack).toHaveBeenCalled();
    expect(mockEmailSend).not.toHaveBeenCalled();
  });

  it("4. Cron sweep re-queues outbox row stuck pending for over 2 minutes", async () => {
    const oldTimestamp = Date.now() - 150_000; // 2.5 minutes ago
    const stuckId = "notif-stuck-test";
    await env.DB.prepare(
      `INSERT INTO notification (id, event_type, channel, dedupe_key, payload, status, attempts, created_at)
       VALUES (?, 'lead_alert', 'email', 'dedupe-stuck-test', ?, 'pending', 0, ?)`
    )
      .bind(
        stuckId,
        JSON.stringify({ leadId: "stuck-l1", name: "Stuck", email: "s@ex.com", service: "SEO", priority: "warm", currency: "USD", source: "widget" }),
        oldTimestamp
      )
      .run();

    const queuedMessages: unknown[] = [];
    const mockQueue = {
      send: async (msg: unknown) => {
        queuedMessages.push(msg);
      }
    } as unknown as Queue;

    const sweepResult = await runCronSweep(env.DB, mockQueue);
    expect(sweepResult.recoveredCount).toBeGreaterThanOrEqual(1);
    expect(queuedMessages.some((m) => (m as { notificationId: string }).notificationId === stuckId)).toBe(true);
  });

  it("5. Handover outside working hours: 'I want to talk to a human' -> callback form -> submit -> creates callback + lead + alerts", async () => {
    // A. Init session
    const initRes = await app.fetch(
      new Request("http://localhost/api/v1/public/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: "turnstile-handover-flow" })
      }),
      env
    );
    const { sessionId } = (await initRes.json()) as { sessionId: string };

    // B. Visitor says: "I want to talk to a human" (outside hours: Sunday)
    const hoTurnRes = await app.fetch(
      new Request(`http://localhost/api/v1/public/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "I want to talk to a human",
          fakeTime: "2026-11-22T22:00:00+05:00" // Explicit Sunday 10 PM PKT
        })
      }),
      env
    );
    expect(hoTurnRes.status).toBe(200);
    const hoData = (await hoTurnRes.json()) as { reply: string; stage: string; buttons?: Array<{ value: string }> };

    // Outside working hours (Sunday test environment): stage is CallbackForm
    expect(hoData.stage).toBe("CallbackForm");
    expect(hoData.reply).toContain("Our live staff is currently offline");
    expect(hoData.reply).toContain("Monday–Friday, 9:00 AM to 7:00 PM PKT");

    // C. Visitor fills and submits callback form
    const cbRes = await app.fetch(
      new Request(`http://localhost/api/v1/public/sessions/${sessionId}/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: "Babar Azam",
          contactEmail: "babar@example.com",
          contactPhone: "+92 301 2345678",
          note: "Need a full digital transformation quote"
        })
      }),
      env
    );
    expect(cbRes.status).toBe(201);
    const cbBody = (await cbRes.json()) as { success: boolean; callbackId: string; leadId: string };
    expect(cbBody.success).toBe(true);
    expect(cbBody.callbackId).toBeDefined();
    expect(cbBody.leadId).toBeDefined();

    // D. Assert callback_request row
    const cbRow = await env.DB.prepare("SELECT * FROM callback_request WHERE id = ?").bind(cbBody.callbackId).first<{ contact_name: string }>();
    expect(cbRow?.contact_name).toBe("Babar Azam");

    // E. Assert lead row with source = callback
    const leadRow = await env.DB.prepare("SELECT * FROM lead WHERE id = ?").bind(cbBody.leadId).first<{ name: string; source: string; priority: string }>();
    expect(leadRow?.name).toBe("Babar Azam");
    expect(leadRow?.source).toBe("callback");
    expect(leadRow?.priority).toBe("hot");

    // F. Assert 2 outbox alert rows (Email + Slack) with dedupe keys
    const emailNotif = await env.DB.prepare("SELECT * FROM notification WHERE dedupe_key = ?")
      .bind(`callback:${cbBody.callbackId}:v1:email`)
      .first<{ channel: string; status: string; payload: string }>();
    expect(emailNotif).toBeDefined();
    expect(emailNotif?.channel).toBe("email");
    expect(emailNotif?.status).toBe("pending");
    expect(emailNotif?.payload).toContain("Babar Azam");

    const slackNotif = await env.DB.prepare("SELECT * FROM notification WHERE dedupe_key = ?")
      .bind(`callback:${cbBody.callbackId}:v1:slack`)
      .first<{ channel: string; status: string }>();
    expect(slackNotif).toBeDefined();
    expect(slackNotif?.channel).toBe("slack");
    expect(slackNotif?.status).toBe("pending");
  });
});
