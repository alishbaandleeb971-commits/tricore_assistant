import { describe, it, expect } from "vitest";
import { sampleWeeklyChats, submitChatReview } from "../src/services/chatReview";
import { env } from "cloudflare:test";

describe("Weekly 20-Chat Review & To-Fix Flow (TASK-038)", () => {
  it("samples chats, records pass/fail review, and creates to-fix item upon fail", async () => {
    // 1. Sample chats for week
    const batchId = await sampleWeeklyChats(env.DB, "2026-W46", 5);
    expect(batchId).toBeDefined();

    const batchRow = await env.DB.prepare("SELECT * FROM review_batch WHERE id = ?").bind(batchId).first();
    expect(batchRow?.week_start).toBe("2026-W46");

    // 2. Seed message and submit a fail review
    const reviewId = "rev-test-1";
    const msgId = "msg-for-rev-1";
    const now = Date.now();

    await env.DB.prepare(
      "INSERT OR IGNORE INTO visitor_session (id, token_hash, created_at, last_seen_at) VALUES ('sess-rev', 'tok-rev', ?, ?)"
    ).bind(now, now).run();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO conversation (id, session_id, stage, outcome, is_test, est_cost, created_at, updated_at) VALUES ('conv-rev', 'sess-rev', 'active', 'open', 0, 0, ?, ?)"
    ).bind(now, now).run();
    await env.DB.prepare(
      "INSERT INTO message (id, conversation_id, seq, sender, content_masked, created_at) VALUES (?, 'conv-rev', 1, 'assistant', 'Test content', ?)"
    ).bind(msgId, now).run();

    await env.DB.prepare(
      "INSERT INTO review (id, batch_id, message_id, mark, reviewed_at) VALUES (?, ?, ?, 'pending', ?)"
    )
      .bind(reviewId, batchId, msgId, now)
      .run();

    // Seed staff user for reviewer FK
    await env.DB.prepare(
      "INSERT OR IGNORE INTO staff_user (id, email, role, status, created_at) VALUES ('usr-rev-staff', 'reviewer@tricoredigitaltech.com', 'staff', 'active', ?)"
    ).bind(now).run();

    await submitChatReview(env.DB, reviewId, "usr-rev-staff", "fail", "Correct answer is 2 weeks");

    // Verify review updated
    const rev = await env.DB.prepare("SELECT * FROM review WHERE id = ?").bind(reviewId).first();
    expect(rev?.mark).toBe("fail");

    // Verify tofix_item created
    const tofix = await env.DB.prepare("SELECT * FROM tofix_item WHERE review_id = ?").bind(reviewId).first();
    expect(tofix?.status).toBe("open");
    expect(tofix?.correct_answer).toBe("Correct answer is 2 weeks");
  });
});
