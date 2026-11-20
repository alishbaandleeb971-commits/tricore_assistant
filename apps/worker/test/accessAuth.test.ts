import { describe, it, expect } from "vitest";
import app from "../src/index";
import { env } from "cloudflare:test";

describe("Cloudflare Access Auth Middleware & RBAC (TASK-032)", () => {
  it("rejects unauthenticated requests to staff routes with 401", async () => {
    const req = new Request("http://localhost/api/v1/staff/me");
    const res = await app.fetch(req, env);
    expect(res.status).toBe(401);
  });

  it("authenticates staff user and returns profile on /staff/me", async () => {
    // Seed staff user
    const now = Date.now();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO staff_user (id, email, role, status, created_at) VALUES ('usr-staff', 'staff@tricoredigitaltech.com', 'staff', 'active', ?)"
    ).bind(now).run();

    const req = new Request("http://localhost/api/v1/staff/me", {
      headers: { "X-Mock-Staff-Email": "staff@tricoredigitaltech.com" }
    });

    const res = await app.fetch(req, env);
    expect(res.status).toBe(200);

    const body = (await res.json()) as { user: { email: string; role: string } };
    expect(body.user.email).toBe("staff@tricoredigitaltech.com");
    expect(body.user.role).toBe("staff");
  });

  it("blocks non-admin users from admin-only routes with 403", async () => {
    const req = new Request("http://localhost/api/v1/staff/admin-action", {
      method: "POST",
      headers: { "X-Mock-Staff-Email": "staff@tricoredigitaltech.com" }
    });

    const res = await app.fetch(req, env);
    expect(res.status).toBe(403);
  });
});
