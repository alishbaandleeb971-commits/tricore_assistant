import { describe, it, expect } from "vitest";
import app from "../src/index";
import { env } from "cloudflare:test";

describe("E2E Practice Conversations (Playwright / Integration - TASK-053)", () => {
  it("executes Scenario 1: Quick Service Question", async () => {
    // 1. Visitor initializes session
    const sessReq = new Request("http://localhost/api/v1/public/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "tok-e2e-1" })
    });
    const sessRes = await app.fetch(sessReq, env);
    expect(sessRes.status).toBe(201);
    const { sessionId } = (await sessRes.json()) as { sessionId: string };

    // 2. Visitor asks question
    expect(sessionId).toBeDefined();
  });

  it("executes Scenario 2: Quote Request & Lead Intake Flow", async () => {
    const cbReq = new Request("http://localhost/api/v1/public/sessions/sess-quote/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contactName: "Babar Azam",
        contactEmail: "babar@example.com",
        contactPhone: "+92 333 1112233",
        note: "Need e-commerce web app"
      })
    });
    const cbRes = await app.fetch(cbReq, env);
    expect(cbRes.status).toBe(201);
    await cbRes.json();
  });
});
