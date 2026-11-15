import { describe, it, expect, beforeEach } from "vitest";
import app from "../src/index.js";
import { env } from "cloudflare:test";
import {
  capturedDispatches,
  clearCapturedDispatches,
  fakeEmailSend,
  fakeSlackPost,
  dispatchNotification
} from "../src/services/dispatcher.js";

describe("Stage G3 End-to-End HTTP Integration Tests", () => {
  beforeEach(() => {
    clearCapturedDispatches();
  });

  it("1. Full lead flow: consent -> name, email, service -> lead row + notification row + captured email & Slack payloads", async () => {
    // A. Init session
    const initReq = new Request("http://localhost/api/v1/public/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "turnstile-lead-test" })
    });
    const initRes = await app.fetch(initReq, env);
    expect(initRes.status).toBe(201);
    const { sessionId } = (await initRes.json()) as { sessionId: string };

    // B. Visitor gives consent
    const consentReq = new Request(`http://localhost/api/v1/public/sessions/${sessionId}/consent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision: true, wordingVersion: 1 })
    });
    const consentRes = await app.fetch(consentReq, env);
    expect(consentRes.status).toBe(200);
    const consentData = (await consentRes.json()) as { success: boolean; consentId: string; allowedToIntake: boolean };
    expect(consentData.success).toBe(true);
    expect(consentData.allowedToIntake).toBe(true);
    expect(consentData.consentId).toBeDefined();

    // C. Visitor submits lead info
    const leadReq = new Request(`http://localhost/api/v1/public/sessions/${sessionId}/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Kamran Akmal",
        email: "kamran@example.com",
        serviceSlug: "ai-services",
        phone: "+92 300 9876543",
        currency: "USD",
        description: "Looking for automated customer support AI chatbot"
      })
    });
    const leadRes = await app.fetch(leadReq, env);
    expect(leadRes.status).toBe(201);
    const leadResult = (await leadRes.json()) as {
      success: boolean;
      leadId: string;
      notificationId: string;
      priority: string;
    };
    expect(leadResult.success).toBe(true);
    expect(leadResult.leadId).toBeDefined();
    expect(leadResult.notificationId).toBeDefined();

    // D. Assert lead row in D1
    const leadRow = await env.DB.prepare("SELECT * FROM lead WHERE id = ?")
      .bind(leadResult.leadId)
      .first<{ id: string; name: string; email: string; phone: string; priority: string; source: string }>();
    expect(leadRow).toBeDefined();
    expect(leadRow?.name).toBe("Kamran Akmal");
    expect(leadRow?.email).toBe("kamran@example.com");
    expect(leadRow?.phone).toBe("+92 300 9876543");
    expect(leadRow?.source).toBe("widget");

    // E. Assert notification row in D1
    const notifRow = await env.DB.prepare("SELECT * FROM notification WHERE id = ?")
      .bind(leadResult.notificationId)
      .first<{ id: string; event_type: string; payload: string; status: string; dedupe_key: string }>();
    expect(notifRow).toBeDefined();
    expect(notifRow?.event_type).toBe("lead_alert");
    expect(notifRow?.dedupe_key).toBe(`lead:${leadResult.leadId}`);

    // F. Process notification with fake adapters for email and Slack
    const dispatchRes = await dispatchNotification(
      notifRow!.payload,
      {
        emailSend: fakeEmailSend,
        slackPost: fakeSlackPost
      },
      { SLACK_WEBHOOK_URL: "https://hooks.slack.com/services/DUMMY/SLACK/WEBHOOK" }
    );
    expect(dispatchRes.status).toBe("delivered");

    // G. Verify captured email and Slack payloads
    expect(capturedDispatches.length).toBe(2);
    const emailDispatch = capturedDispatches.find((d) => d.type === "email");
    const slackDispatch = capturedDispatches.find((d) => d.type === "slack");

    expect(emailDispatch).toBeDefined();
    expect(emailDispatch?.toOrUrl).toBe("team@tricoredigitaltech.com");
    expect(emailDispatch?.subjectOrText).toContain("Kamran Akmal");
    expect(emailDispatch?.body).toContain("Email: kamran@example.com");
    expect(emailDispatch?.body).toContain("Service: ai-services");

    expect(slackDispatch).toBeDefined();
    expect(slackDispatch?.toOrUrl).toBe("https://hooks.slack.com/services/DUMMY/SLACK/WEBHOOK");
    expect(slackDispatch?.subjectOrText).toContain("Kamran Akmal");
    expect(slackDispatch?.subjectOrText).toContain("Service: ai-services");
  });

  it("2. Handover outside working hours -> callback form -> callback row + lead row + alert", async () => {
    // A. Init session
    const initReq = new Request("http://localhost/api/v1/public/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "turnstile-outside-hours" })
    });
    const initRes = await app.fetch(initReq, env);
    const { sessionId } = (await initRes.json()) as { sessionId: string };

    // B. Request handover outside working hours (Sunday 22:00 PKT)
    const hoReq = new Request(`http://localhost/api/v1/public/sessions/${sessionId}/handover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fakeTime: "2026-11-15T22:00:00+05:00" })
    });
    const hoRes = await app.fetch(hoReq, env);
    expect(hoRes.status).toBe(200);
    const hoData = (await hoRes.json()) as { status: string; canLiveChat: boolean; showCallbackForm: boolean };
    expect(hoData.status).toBe("outside_hours");
    expect(hoData.canLiveChat).toBe(false);
    expect(hoData.showCallbackForm).toBe(true);

    // C. Visitor submits callback form
    const cbReq = new Request(`http://localhost/api/v1/public/sessions/${sessionId}/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contactName: "Zainab Bibi",
        contactEmail: "zainab@example.com",
        contactPhone: "+92 312 3456789",
        note: "Urgent inquiry about mobile app development"
      })
    });
    const cbRes = await app.fetch(cbReq, env);
    expect(cbRes.status).toBe(201);
    const cbResult = (await cbRes.json()) as { success: boolean; callbackId: string };
    expect(cbResult.success).toBe(true);
    expect(cbResult.callbackId).toBeDefined();

    // D. Assert callback_request row in D1
    const cbRow = await env.DB.prepare("SELECT * FROM callback_request WHERE id = ?")
      .bind(cbResult.callbackId)
      .first<{ id: string; lead_id: string; contact_name: string; contact_email: string; contact_phone: string }>();
    expect(cbRow).toBeDefined();
    expect(cbRow?.contact_name).toBe("Zainab Bibi");
    expect(cbRow?.contact_email).toBe("zainab@example.com");

    // E. Assert lead row in D1 (linked to callback)
    const leadRow = await env.DB.prepare("SELECT * FROM lead WHERE id = ?")
      .bind(cbRow!.lead_id)
      .first<{ id: string; name: string; email: string; priority: string; source: string }>();
    expect(leadRow).toBeDefined();
    expect(leadRow?.name).toBe("Zainab Bibi");
    expect(leadRow?.priority).toBe("hot");
    expect(leadRow?.source).toBe("callback");

    // F. Assert notification alert in D1
    const notifRow = await env.DB.prepare("SELECT * FROM notification WHERE dedupe_key = ?")
      .bind(`callback:${cbResult.callbackId}`)
      .first<{ id: string; event_type: string; payload: string }>();
    expect(notifRow).toBeDefined();
    expect(notifRow?.event_type).toBe("lead_alert");
    expect(notifRow?.payload).toContain("Zainab Bibi");
    expect(notifRow?.payload).toContain("hot");
  });

  it("3. Handover inside working hours (fake the clock) -> times out at 180 s -> callback form", async () => {
    // A. Init session
    const initReq = new Request("http://localhost/api/v1/public/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "turnstile-inside-hours" })
    });
    const initRes = await app.fetch(initReq, env);
    const { sessionId } = (await initRes.json()) as { sessionId: string };

    // B. Request handover inside working hours (Wednesday 14:00 PKT)
    const hoReq = new Request(`http://localhost/api/v1/public/sessions/${sessionId}/handover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fakeTime: "2026-11-18T14:00:00+05:00" })
    });
    const hoRes = await app.fetch(hoReq, env);
    expect(hoRes.status).toBe(200);
    const hoData = (await hoRes.json()) as {
      status: string;
      canLiveChat: boolean;
      showCallbackForm: boolean;
      deadlineAt: number;
      handoverId: string;
    };
    expect(hoData.status).toBe("pending");
    expect(hoData.canLiveChat).toBe(true);
    expect(hoData.showCallbackForm).toBe(false);
    expect(hoData.deadlineAt).toBeGreaterThan(Date.now() + 170_000);

    // C. Simulate the 180s DO timeout alarm firing
    const alarmReq = new Request(`http://localhost/api/v1/public/sessions/${sessionId}/alarm`, {
      method: "POST"
    });
    const alarmRes = await app.fetch(alarmReq, env);
    expect(alarmRes.status).toBe(200);
    await alarmRes.json();

    // D. Poll handover status -> should be timed_out and showCallbackForm: true
    const pollReq = new Request(`http://localhost/api/v1/public/sessions/${sessionId}/handover`, {
      method: "GET"
    });
    const pollRes = await app.fetch(pollReq, env);
    expect(pollRes.status).toBe(200);
    const pollData = (await pollRes.json()) as { status: string; showCallbackForm: boolean; message: string };
    expect(pollData.status).toBe("timed_out");
    expect(pollData.showCallbackForm).toBe(true);
    expect(pollData.message).toContain("callback");
  });

  it("4. Card number in a message -> show the stored message row is masked", async () => {
    // A. Init session
    const initReq = new Request("http://localhost/api/v1/public/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "turnstile-card-mask" })
    });
    const initRes = await app.fetch(initReq, env);
    const { sessionId } = (await initRes.json()) as { sessionId: string };

    // B. Send message containing real test visa card number
    const msgReq = new Request(`http://localhost/api/v1/public/sessions/${sessionId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Here is my card number 4111 1111 1111 1111 for the deposit" })
    });
    const msgRes = await app.fetch(msgReq, env);
    expect(msgRes.status).toBe(200);
    const msgData = (await msgRes.json()) as { reply: string };
    expect(msgData.reply).toContain("please do not share credit card numbers");

    // C. Inspect D1 message table
    const rows = await env.DB.prepare(
      `SELECT m.sender, m.content_masked
       FROM message m
       JOIN conversation c ON c.id = m.conversation_id
       WHERE c.session_id = ?
       ORDER BY m.seq ASC`
    )
      .bind(sessionId)
      .all<{ sender: string; content_masked: string }>();

    expect(rows.results.length).toBeGreaterThanOrEqual(2);
    const visitorRow = rows.results.find((r) => r.sender === "visitor");
    expect(visitorRow).toBeDefined();

    // Verify stored text is masked and contains NO raw card digits
    expect(visitorRow?.content_masked).toContain("[hidden]");
    expect(visitorRow?.content_masked).not.toContain("4111");
    expect(visitorRow?.content_masked).not.toContain("1111 1111");
  });
});
