import { describe, it, expect } from "vitest";
import app from "../src/index";
import { env } from "cloudflare:test";

describe("Staff Knowledge Management & Release API (TASK-034)", () => {
  it("allows staff to draft an entry and admin to approve and publish release", async () => {
    // 1. Seed staff and admin users
    const now = Date.now();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO staff_user (id, email, role, status, created_at) VALUES ('usr-staff-kb', 'staffkb@tricoredigitaltech.com', 'staff', 'active', ?)"
    ).bind(now).run();

    await env.DB.prepare(
      "INSERT OR IGNORE INTO staff_user (id, email, role, status, created_at) VALUES ('usr-admin-kb', 'adminkb@tricoredigitaltech.com', 'admin', 'active', ?)"
    ).bind(now).run();

    // 2. Draft entry as Staff
    const draftReq = new Request("http://localhost/api/v1/staff/knowledge/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Mock-Staff-Email": "staffkb@tricoredigitaltech.com"
      },
      body: JSON.stringify({
        title: "Refund Policy Details",
        entryType: "policy",
        body: "All refunds are evaluated by our billing department."
      })
    });

    const draftRes = await app.fetch(draftReq, env);
    expect(draftRes.status).toBe(201);
    const draftBody = (await draftRes.json()) as { entryId: string };
    expect(draftBody.entryId).toBeDefined();

    // 3. Approve as Admin
    const approveReq = new Request(`http://localhost/api/v1/staff/knowledge/entries/${draftBody.entryId}/approve`, {
      method: "POST",
      headers: {
        "X-Mock-Staff-Email": "adminkb@tricoredigitaltech.com"
      }
    });

    const approveRes = await app.fetch(approveReq, env);
    expect(approveRes.status).toBe(200);

    // 4. Publish Release as Admin
    const releaseReq = new Request("http://localhost/api/v1/staff/knowledge/releases", {
      method: "POST",
      headers: {
        "X-Mock-Staff-Email": "adminkb@tricoredigitaltech.com"
      }
    });

    const releaseRes = await app.fetch(releaseReq, env);
    expect(releaseRes.status).toBe(201);
    const releaseBody = (await releaseRes.json()) as { releaseNo: number };
    expect(releaseBody.releaseNo).toBeGreaterThanOrEqual(1);
  });
});
