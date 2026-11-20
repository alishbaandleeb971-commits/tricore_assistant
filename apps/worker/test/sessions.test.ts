import { describe, it, expect } from "vitest";
import app from "../src/index";
import { env } from "cloudflare:test";

describe("Public Sessions API (TASK-011)", () => {
  it("creates a new visitor session with valid Turnstile token (zero IP storage)", async () => {
    const req = new Request("http://localhost/api/v1/public/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "test-valid-turnstile-token" })
    });

    const res = await app.fetch(req, env);
    expect(res.status).toBe(201);

    const body = (await res.json()) as { sessionId: string; greeting: string; quickButtons: unknown[] };
    expect(body.sessionId).toBeDefined();
    expect(body.greeting).toContain("TriCore Digital Tech");
    expect(body.quickButtons.length).toBeGreaterThan(0);

    // Verify row in D1
    const row = await env.DB.prepare("SELECT * FROM visitor_session WHERE id = ?").bind(body.sessionId).first();
    expect(row).toBeDefined();
    expect(row?.token_hash).toBeDefined();
  });

  it("rejects request missing turnstile token with 400", async () => {
    const req = new Request("http://localhost/api/v1/public/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });

    const res = await app.fetch(req, env);
    expect(res.status).toBe(400);
  });

  it("rejects invalid turnstile token with 403", async () => {
    const req = new Request("http://localhost/api/v1/public/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "invalid-token" })
    });

    const res = await app.fetch(req, env);
    expect(res.status).toBe(403);
  });

  // Regression test: ERR-005 — same Turnstile token must NOT cause UNIQUE constraint failure
  // Previously, hashToken(token) was called on the client-supplied token directly, so sending
  // the same fixed token (e.g. "widget-client-token") twice produced the same SHA-256 hash
  // and crashed with D1_ERROR: UNIQUE constraint failed: visitor_session.token_hash.
  it("creates 3 sessions in a row with the SAME client token and all succeed with distinct token hashes", async () => {
    const FIXED_TOKEN = "widget-client-token"; // the constant the widget always sends

    const ids: string[] = [];
    const hashes: string[] = [];

    for (let i = 0; i < 3; i++) {
      const req = new Request("http://localhost/api/v1/public/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: FIXED_TOKEN })
      });
      const res = await app.fetch(req, env);
      // Before the fix this would return 500 on the 2nd and 3rd call.
      expect(res.status).toBe(201);
      const body = (await res.json()) as { sessionId: string };
      ids.push(body.sessionId);

      const row = await env.DB.prepare("SELECT token_hash FROM visitor_session WHERE id = ?")
        .bind(body.sessionId)
        .first<{ token_hash: string }>();
      expect(row?.token_hash).toBeDefined();
      hashes.push(row!.token_hash);
    }

    // 3 distinct session IDs
    expect(new Set(ids).size).toBe(3);
    // 3 distinct token hashes — the UNIQUE constraint must never be violated
    expect(new Set(hashes).size).toBe(3);
  });
});
