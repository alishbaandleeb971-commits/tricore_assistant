import { describe, it, expect, beforeAll } from "vitest";
import app from "../src/index.js";
import { env } from "cloudflare:test";

describe("Live HTTP Message Flow & D1 Persistence Integration Test", () => {
  let sessionId: string;

  beforeAll(async () => {
    // 1. Initialize session via POST /api/v1/public/sessions
    const initReq = new Request("http://localhost/api/v1/public/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "test-turnstile-token" })
    });
    const initRes = await app.fetch(initReq, env);
    expect(initRes.status).toBe(201);
    const data = (await initRes.json()) as { sessionId: string };
    sessionId = data.sessionId;
    expect(sessionId).toBeDefined();
  });

  it("handles 'Do you do SEO?' via HTTP, extracts SEO content, and stores messages in D1", async () => {
    const msgReq = new Request(`http://localhost/api/v1/public/sessions/${sessionId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Do you do SEO?" })
    });

    const msgRes = await app.fetch(msgReq, env);
    expect(msgRes.status).toBe(200);

    const body = (await msgRes.json()) as { reply: string; usedChunkIds: string[] };
    expect(body.reply.toLowerCase()).toContain("seo");
    expect(body.reply.toLowerCase()).toContain("search engine");

    // Assert message rows exist in D1
    const messages = await env.DB.prepare(
      "SELECT sender, content_masked FROM message WHERE conversation_id IN (SELECT id FROM conversation WHERE session_id = ?) ORDER BY seq ASC"
    )
      .bind(sessionId)
      .all<{ sender: string; content_masked: string }>();

    expect(messages.results.length).toBeGreaterThanOrEqual(2);
    expect(messages.results[0].sender).toBe("visitor");
    expect(messages.results[0].content_masked).toBe("Do you do SEO?");
    expect(messages.results[1].sender).toBe("assistant");
    expect(messages.results[1].content_masked.toLowerCase()).toContain("seo");
  });

  it("handles 'How much does a website cost?' via HTTP and gives no price", async () => {
    const msgReq = new Request(`http://localhost/api/v1/public/sessions/${sessionId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "How much does a website cost?" })
    });

    const msgRes = await app.fetch(msgReq, env);
    expect(msgRes.status).toBe(200);

    const body = (await msgRes.json()) as { reply: string };
    // Must refuse price and offer custom quote proposal
    expect(body.reply).not.toMatch(/\$\d+/);
    expect(body.reply).not.toMatch(/rs\.?\s*\d+/i);
    expect(body.reply.toLowerCase()).toContain("quote");
  });
});
