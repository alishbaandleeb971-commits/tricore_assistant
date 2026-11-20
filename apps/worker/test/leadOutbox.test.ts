import { describe, it, expect } from "vitest";
import { createLeadAndOutboxBatch } from "../src/services/leadOutbox";
import { env } from "cloudflare:test";

describe("Atomic D1 Outbox & Notification Job (TASK-023)", () => {
  it("atomically creates lead and notification outbox record with deduplication key", async () => {
    const now = Date.now();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO visitor_session (id, token_hash, created_at, last_seen_at) VALUES ('sess-outbox', 'tok-out', ?, ?)"
    ).bind(now, now).run();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO conversation (id, session_id, stage, outcome, is_test, est_cost, created_at, updated_at) VALUES ('conv-outbox', 'sess-outbox', 'active', 'open', 0, 0, ?, ?)"
    ).bind(now, now).run();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO consent_record (id, conversation_id, wording_version, purpose, decision, recorded_at) VALUES ('consent-outbox', 'conv-outbox', 1, 'lead_contact', 1, ?)"
    ).bind(now).run();

    // Fetch a real seeded budget and timeline option ID from D1
    const bRow = await env.DB.prepare("SELECT id FROM budget_range WHERE meets_hot_threshold = 1 LIMIT 1").first<{ id: string }>();
    const tRow = await env.DB.prepare("SELECT id FROM timeline_option WHERE within_3_months = 1 LIMIT 1").first<{ id: string }>();

    const res = await createLeadAndOutboxBatch(env.DB, null, {
      conversationId: "conv-outbox",
      consentId: "consent-outbox",
      intakeData: {
        name: "Usman Ghani",
        email: "usman@example.com",
        serviceSlug: "ai-services",
        currency: "USD",
        phone: "+92 321 9876543",
        budgetRangeId: bRow?.id,
        timelineOptionId: tRow?.id,
        description: "Need enterprise AI automation"
      }
    });

    expect(res.leadId).toBeDefined();
    expect(res.emailNotificationId).toBeDefined();
    expect(res.slackNotificationId).toBeDefined();
    expect(res.priority).toBe("hot");

    // Verify atomic persistence in D1
    const leadRow = await env.DB.prepare("SELECT * FROM lead WHERE id = ?").bind(res.leadId).first<{ name: string; priority: string }>();
    expect(leadRow?.name).toBe("Usman Ghani");
    expect(leadRow?.priority).toBe("hot");

    const emailRow = await env.DB.prepare("SELECT * FROM notification WHERE id = ?").bind(res.emailNotificationId).first<{ status: string; dedupe_key: string; channel: string }>();
    expect(emailRow?.status).toBe("pending");
    expect(emailRow?.channel).toBe("email");
    expect(emailRow?.dedupe_key).toBe(`lead:${res.leadId}:v1:email`);

    const slackRow = await env.DB.prepare("SELECT * FROM notification WHERE id = ?").bind(res.slackNotificationId).first<{ status: string; dedupe_key: string; channel: string }>();
    expect(slackRow?.status).toBe("pending");
    expect(slackRow?.channel).toBe("slack");
    expect(slackRow?.dedupe_key).toBe(`lead:${res.leadId}:v1:slack`);
  });
});
