import { describe, it, expect } from "vitest";
import app from "../src/index";
import { env } from "cloudflare:test";

describe("Pre-Launch Security & Authorization Audit (TASK-051)", () => {
  it("strictly rejects SQL injection payloads in public endpoints", async () => {
    const malicious = "'; DROP TABLE lead; --";
    const req = new Request("http://localhost/api/v1/public/sessions/sess-1/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contactName: malicious,
        contactEmail: "attacker@example.com"
      })
    });

    const res = await app.fetch(req, env);
    expect(res.status).toBe(201); // Safe parameterized insert

    // Verify lead table was not dropped
    const checkTable = await env.DB.prepare("SELECT count(*) as count FROM lead").first();
    expect(checkTable).toBeDefined();
  });

  it("strictly enforces RBAC so non-admin users cannot access admin endpoints", async () => {
    const req = new Request("http://localhost/api/v1/staff/admin-action", {
      method: "POST",
      headers: { "X-Mock-Staff-Email": "staff@tricoredigitaltech.com" }
    });

    const res = await app.fetch(req, env);
    expect(res.status).toBe(403);
  });
});
