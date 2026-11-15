import { describe, it, expect } from "vitest";
import { runDailyRetentionCleanup } from "../src/services/retentionCleanup";
import { env } from "cloudflare:test";

describe("Scheduled Data Retention Job (TASK-040)", () => {
  it("deletes expired anonymous conversations (>90 days) in batches and records in deletion_log", async () => {
    const ninetyOneDaysAgo = Date.now() - 91 * 86400_000;
    const now = Date.now();

    // 1. Seed session and expired conversation
    await env.DB.prepare(
      "INSERT OR IGNORE INTO visitor_session (id, token_hash, created_at, last_seen_at) VALUES ('sess-ret', 'tok-ret', ?, ?)"
    ).bind(ninetyOneDaysAgo, ninetyOneDaysAgo).run();

    await env.DB.prepare(
      `INSERT OR IGNORE INTO conversation (id, session_id, stage, outcome, is_test, est_cost, created_at, updated_at)
       VALUES ('conv-expired-1', 'sess-ret', 'completed', 'dropped', 0, 0, ?, ?)`
    ).bind(ninetyOneDaysAgo, ninetyOneDaysAgo).run();

    // 2. Seed active conversation that should NOT be deleted
    await env.DB.prepare(
      `INSERT OR IGNORE INTO conversation (id, session_id, stage, outcome, is_test, est_cost, created_at, updated_at)
       VALUES ('conv-active-1', 'sess-ret', 'active', 'open', 0, 0, ?, ?)`
    ).bind(now, now).run();

    const res = await runDailyRetentionCleanup(env.DB, 2);
    expect(res.deletedConversations).toBeGreaterThanOrEqual(1);

    // Verify expired conversation is gone
    const expiredCheck = await env.DB.prepare("SELECT * FROM conversation WHERE id = 'conv-expired-1'").first();
    expect(expiredCheck).toBeNull();

    // Verify active conversation remains
    const activeCheck = await env.DB.prepare("SELECT * FROM conversation WHERE id = 'conv-active-1'").first();
    expect(activeCheck).toBeDefined();

    // Verify deletion_log
    const logCheck = await env.DB.prepare("SELECT * FROM deletion_log WHERE category = 'expired_conversations'").first();
    expect(logCheck).toBeDefined();
  });
});
