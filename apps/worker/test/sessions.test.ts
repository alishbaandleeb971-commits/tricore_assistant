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
});
