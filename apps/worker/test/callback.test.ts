import { describe, it, expect } from "vitest";
import app from "../src/index";
import { env } from "cloudflare:test";

describe("Callback Request Intake API (TASK-029)", () => {
  it("submits callback form, creates callback + lead + urgent outbox notification", async () => {
    // Seed session in D1
    const now = Date.now();
    await env.DB.prepare(
      "INSERT OR IGNORE INTO visitor_session (id, token_hash, created_at, last_seen_at) VALUES ('sess-cb', 'tok-cb', ?, ?)"
    ).bind(now, now).run();

    const req = new Request("http://localhost/api/v1/public/sessions/sess-cb/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contactName: "Tariq Mahmood",
        contactEmail: "tariq@example.com",
        contactPhone: "+92 300 7654321",
        note: "Need urgent web development quote"
      })
    });

    const res = await app.fetch(req, env);
    expect(res.status).toBe(201);

    const body = (await res.json()) as { success: boolean; callbackId: string };
    expect(body.success).toBe(true);
    expect(body.callbackId).toBeDefined();

    // Verify callback row
    const cbRow = await env.DB.prepare("SELECT * FROM callback_request WHERE id = ?").bind(body.callbackId).first();
    expect(cbRow?.contact_name).toBe("Tariq Mahmood");

    // Verify lead row
    const leadRow = await env.DB.prepare("SELECT * FROM lead WHERE id = ?").bind(cbRow?.lead_id).first();
    expect(leadRow?.name).toBe("Tariq Mahmood");
    expect(leadRow?.source).toBe("callback");
    expect(leadRow?.priority).toBe("hot");

    // Verify urgent notification
    const notif = await env.DB.prepare("SELECT * FROM notification WHERE dedupe_key = ?").bind(`callback:${body.callbackId}`).first();
    expect(notif?.status).toBe("pending");
  });
});
