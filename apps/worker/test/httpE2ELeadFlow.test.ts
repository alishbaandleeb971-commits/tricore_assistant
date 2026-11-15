import { describe, it, expect, beforeEach } from "vitest";
import app from "../src/index.js";
import { env } from "cloudflare:test";
import { clearCapturedDispatches } from "../src/services/dispatcher.js";

describe("Deterministic Conversational Lead Flow through HTTP Route (TASK-021)", () => {
  beforeEach(() => {
    clearCapturedDispatches();
  });

  it("completes full deterministic lead flow: quote -> consent yes -> name -> email -> service -> skip optionals -> confirm", async () => {
    // 1. Init session
    const initReq = new Request("http://localhost/api/v1/public/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "turnstile-lead-http-test" })
    });
    const initRes = await app.fetch(initReq, env);
    expect(initRes.status).toBe(201);
    const { sessionId } = (await initRes.json()) as { sessionId: string };

    const sendMessage = async (text: string) => {
      const req = new Request(`http://localhost/api/v1/public/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const res = await app.fetch(req, env);
      expect(res.status).toBe(200);
      return (await res.json()) as {
        reply: string;
        stage: string;
        buttons?: Array<{ label: string; value: string }>;
        confirmCard?: Record<string, unknown>;
        leadId?: string;
      };
    };

    // Step 1: Trigger quote request
    const r1 = await sendMessage("I want a quote");
    expect(r1.stage).toBe("LeadConsent");
    expect(r1.reply).toContain("TriCore Digital Tech would like to collect your name, email, and service preference");
    expect(r1.buttons?.some((b) => b.value === "yes")).toBe(true);
    expect(r1.buttons?.some((b) => b.value === "no")).toBe(true);

    // Step 2: Consent YES
    const r2 = await sendMessage("agree");
    expect(r2.stage).toBe("LeadCollecting");
    expect(r2.reply).toContain("what is your full name");

    // Step 3: Provide Name
    const r3 = await sendMessage("Kamran Akmal");
    expect(r3.stage).toBe("LeadCollecting");
    expect(r3.reply).toContain("best email address");

    // Step 4: Provide Email
    const r4 = await sendMessage("kamran@example.com");
    expect(r4.stage).toBe("LeadCollecting");
    expect(r4.reply).toContain("Which service are you most interested in");
    expect(r4.buttons?.length).toBe(8);

    // Step 5: Interruption test mid-flow: ask question "wait, do you do SEO?"
    const r5Faq = await sendMessage("wait, do you do SEO?");
    expect(r5Faq.stage).toBe("LeadCollecting");
    expect(r5Faq.reply.toLowerCase()).toContain("seo");
    expect(r5Faq.reply).toContain("Which service are you most interested in");

    // Step 6: Select Service
    const r6 = await sendMessage("web-development");
    expect(r6.stage).toBe("LeadCollecting");
    expect(r6.reply).toContain("phone number");

    // Step 7: Skip phone
    const r7 = await sendMessage("skip");
    expect(r7.stage).toBe("LeadCollecting");
    expect(r7.reply).toContain("currency");

    // Step 8: Choose USD
    const r8 = await sendMessage("USD");
    expect(r8.stage).toBe("LeadCollecting");
    expect(r8.reply).toContain("what would you like us to build");

    // Step 9: Skip description -> reaches confirmation card
    const r9 = await sendMessage("skip");
    expect(r9.stage).toBe("LeadConfirm");
    expect(r9.confirmCard).toBeDefined();
    expect(r9.confirmCard?.name).toBe("Kamran Akmal");
    expect(r9.confirmCard?.email).toBe("kamran@example.com");
    expect(r9.buttons?.some((b) => b.value === "confirm")).toBe(true);

    // Step 10: Confirm
    const r10 = await sendMessage("confirm");
    expect(r10.stage).toBe("Chatting");
    expect(r10.reply).toContain("saved");
    expect(r10.leadId).toBeDefined();

    // Verify D1 records
    const leadRow = await env.DB.prepare("SELECT * FROM lead WHERE id = ?")
      .bind(r10.leadId)
      .first<{ id: string; name: string; email: string }>();
    expect(leadRow).toBeDefined();
    expect(leadRow?.name).toBe("Kamran Akmal");
    expect(leadRow?.email).toBe("kamran@example.com");

    const consentRow = await env.DB.prepare(
      "SELECT cr.* FROM consent_record cr JOIN conversation c ON c.id = cr.conversation_id WHERE c.session_id = ?"
    )
      .bind(sessionId)
      .first<{ decision: number }>();
    expect(consentRow).toBeDefined();
    expect(consentRow?.decision).toBe(1);

    const notifRow = await env.DB.prepare("SELECT * FROM notification WHERE dedupe_key = ?")
      .bind(`lead:${r10.leadId}`)
      .first<{ id: string; event_type: string }>();
    expect(notifRow).toBeDefined();
    expect(notifRow?.event_type).toBe("lead_alert");
  });

  it("handles consent decline: quote -> consent no -> returns to Chatting with NO lead row created", async () => {
    // 1. Init session
    const initReq = new Request("http://localhost/api/v1/public/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "turnstile-lead-decline-test" })
    });
    const initRes = await app.fetch(initReq, env);
    const { sessionId } = (await initRes.json()) as { sessionId: string };

    const sendMessage = async (text: string) => {
      const req = new Request(`http://localhost/api/v1/public/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const res = await app.fetch(req, env);
      return (await res.json()) as { reply: string; stage: string; leadId?: string };
    };

    // Step 1: Quote
    const r1 = await sendMessage("Can I get a quote?");
    expect(r1.stage).toBe("LeadConsent");

    // Step 2: Decline consent
    const r2 = await sendMessage("no");
    expect(r2.stage).toBe("Chatting");
    expect(r2.reply).toContain("No problem at all");

    // Verify D1: consent declined recorded (decision = 0), but ZERO lead rows created
    const consentRow = await env.DB.prepare(
      "SELECT cr.* FROM consent_record cr JOIN conversation c ON c.id = cr.conversation_id WHERE c.session_id = ?"
    )
      .bind(sessionId)
      .first<{ decision: number }>();
    expect(consentRow).toBeDefined();
    expect(consentRow?.decision).toBe(0);

    const leadCount = await env.DB.prepare(
      "SELECT count(*) as c FROM lead l JOIN conversation c ON c.id = l.conversation_id WHERE c.session_id = ?"
    )
      .bind(sessionId)
      .first<{ c: number }>();
    expect(leadCount?.c).toBe(0);
  });
});
