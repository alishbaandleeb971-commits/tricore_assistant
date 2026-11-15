import { describe, it, expect } from "vitest";
import { recordVisitorConsent } from "../src/services/consent";
import { env } from "cloudflare:test";

describe("Visitor Privacy Consent Flow (TASK-020)", () => {
  it("records consent agreement and allows transition to intake", async () => {
    // Seed conversation row for FK constraint
    const now = Date.now();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO visitor_session (id, token_hash, created_at, last_seen_at) VALUES ('sess-c1', 'tok1', ?, ?)"
    ).bind(now, now).run();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO conversation (id, session_id, stage, outcome, is_test, est_cost, created_at, updated_at) VALUES ('conv-c1', 'sess-c1', 'active', 'open', 0, 0, ?, ?)"
    ).bind(now, now).run();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO consent_text (version, wording, approved_at) VALUES (1, 'Terms', ?)"
    ).bind(now).run();

    const res = await recordVisitorConsent(env.DB, {
      conversationId: "conv-c1",
      wordingVersion: 1,
      purpose: "lead_contact",
      decision: true
    });

    expect(res.allowedToIntake).toBe(true);
    expect(res.consentId).toBeDefined();

    // Check D1 record
    const row = await env.DB.prepare("SELECT * FROM consent_record WHERE id = ?").bind(res.consentId).first();
    expect(row?.decision).toBe(1);
  });

  it("records consent refusal, forbids intake, and keeps chat active", async () => {
    const now = Date.now();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO visitor_session (id, token_hash, created_at, last_seen_at) VALUES ('sess-c2', 'tok2', ?, ?)"
    ).bind(now, now).run();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO conversation (id, session_id, stage, outcome, is_test, est_cost, created_at, updated_at) VALUES ('conv-c2', 'sess-c2', 'active', 'open', 0, 0, ?, ?)"
    ).bind(now, now).run();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO consent_text (version, wording, approved_at) VALUES (1, 'Terms', ?)"
    ).bind(now).run();

    const res = await recordVisitorConsent(env.DB, {
      conversationId: "conv-c2",
      wordingVersion: 1,
      purpose: "lead_contact",
      decision: false
    });

    expect(res.allowedToIntake).toBe(false);
    expect(res.message).toContain("No problem at all");

    const row = await env.DB.prepare("SELECT * FROM consent_record WHERE id = ?").bind(res.consentId).first();
    expect(row?.decision).toBe(0);
  });
});
