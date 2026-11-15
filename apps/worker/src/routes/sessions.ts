import { Hono } from "hono";
import { uuidv7 } from "uuidv7";
import { verifyTurnstileToken, hashToken } from "../services/turnstile.js";
import { recordVisitorConsent } from "../services/consent.js";
import { createLeadAndOutboxBatch } from "../services/leadOutbox.js";
import { isWithinPktWorkingHours, validateLeadIntake } from "@tricore/shared";

export type SessionEnv = {
  Bindings: {
    DB: D1Database;
    CONVERSATION: DurableObjectNamespace;
    NOTIFY?: Queue;
    TURNSTILE_SECRET?: string;
  };
};

export const sessionsRouter = new Hono<SessionEnv>();

sessionsRouter.post("/:id/messages", async (c) => {
  const sessionId = c.req.param("id");
  const body = await c.req.json<{ text?: string; clientMessageId?: string }>().catch(() => ({ text: undefined }));
  const text = body?.text;

  if (!text || typeof text !== "string" || !text.trim()) {
    return c.json({ error: "missing_or_empty_text" }, 400);
  }

  // Verify session exists in D1
  const sessionRecord = await c.env.DB.prepare(
    "SELECT id FROM visitor_session WHERE id = ?"
  )
    .bind(sessionId)
    .first<{ id: string }>();

  if (!sessionRecord) {
    return c.json({ error: "session_not_found" }, 404);
  }

  // Update session last_seen_at
  await c.env.DB.prepare("UPDATE visitor_session SET last_seen_at = ? WHERE id = ?")
    .bind(Date.now(), sessionId)
    .run();

  // Forward turn to Conversation Durable Object
  const doId = c.env.CONVERSATION.idFromName(sessionId);
  const convDO = c.env.CONVERSATION.get(doId);

  const turnReq = new Request("http://internal/turn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      content: text.trim(),
      clientMessageId: body?.clientMessageId
    })
  });

  const turnRes = await convDO.fetch(turnReq);
  if (!turnRes.ok) {
    return c.json({ error: "conversation_turn_failed" }, 500);
  }

  const turnData = await turnRes.json();
  return c.json(turnData, 200);
});

sessionsRouter.post("/", async (c) => {
  const body = await c.req.json<{ token?: string }>().catch(() => ({ token: undefined }));
  const token = body?.token;

  if (!token) {
    return c.json({ error: "missing_turnstile_token" }, 400);
  }

  const verification = await verifyTurnstileToken(token, c.env.TURNSTILE_SECRET);
  if (!verification.success) {
    return c.json({ error: "turnstile_verification_failed", details: verification.error }, 403);
  }

  const sessionId = uuidv7();
  const tokenHash = await hashToken(token);
  const now = Date.now();

  // Save session with zero IP storage
  await c.env.DB.prepare(
    "INSERT INTO visitor_session (id, token_hash, created_at, last_seen_at) VALUES (?, ?, ?, ?)"
  )
    .bind(sessionId, tokenHash, now, now)
    .run();

  return c.json(
    {
      sessionId,
      greeting: "Hello! Welcome to TriCore Digital Tech. How can I assist your business today?",
      quickButtons: [
        { label: "AI Services", action: "explore_ai" },
        { label: "Web Development", action: "explore_web" },
        { label: "Digital Marketing", action: "explore_marketing" },
        { label: "Speak to a Human", action: "request_handover" }
      ],
      aiStatement: "I am TriCore's AI assistant. I can answer questions about our services."
    },
    201
  );
});

// Consent flow: POST /:id/consent
sessionsRouter.post("/:id/consent", async (c) => {
  const sessionId = c.req.param("id");
  const body = await c.req
    .json<{ decision?: boolean; wordingVersion?: number; purpose?: "lead_contact" | "analytics" }>()
    .catch(() => null);

  if (body === null || typeof body.decision !== "boolean") {
    return c.json({ error: "missing_or_invalid_consent_decision" }, 400);
  }

  // Ensure conversation row exists
  let conv = await c.env.DB.prepare(
    "SELECT id FROM conversation WHERE session_id = ? ORDER BY created_at DESC LIMIT 1"
  )
    .bind(sessionId)
    .first<{ id: string }>();

  let convId = conv?.id;
  if (!convId) {
    convId = uuidv7();
    const now = Date.now();
    await c.env.DB.prepare(
      "INSERT INTO conversation (id, session_id, stage, outcome, is_test, est_cost, created_at, updated_at) VALUES (?, ?, 'active', 'open', 0, 0, ?, ?)"
    )
      .bind(convId, sessionId, now, now)
      .run();
  }

  const result = await recordVisitorConsent(c.env.DB, {
    conversationId: convId,
    wordingVersion: body.wordingVersion || 1,
    purpose: body.purpose || "lead_contact",
    decision: body.decision
  });

  return c.json({ success: true, ...result }, 200);
});

// Full lead intake: POST /:id/lead
sessionsRouter.post("/:id/lead", async (c) => {
  const sessionId = c.req.param("id");
  const body = await c.req
    .json<{
      name?: string;
      email?: string;
      serviceSlug?: string;
      phone?: string;
      currency?: string;
      description?: string;
      budgetRangeId?: string;
      timelineOptionId?: string;
      consentId?: string;
    }>()
    .catch(() => null);

  if (!body || !body.name || !body.email || !body.serviceSlug) {
    return c.json({ error: "missing_required_fields", message: "Name, email, and service are required." }, 400);
  }

  const validation = validateLeadIntake({
    name: body.name,
    email: body.email,
    serviceSlug: body.serviceSlug,
    phone: body.phone,
    currency: (body.currency as "USD" | "PKR") || "USD",
    description: body.description,
    budgetRangeId: body.budgetRangeId,
    timelineOptionId: body.timelineOptionId
  });

  if (!validation.valid) {
    return c.json({ error: "validation_failed", errors: validation.errors }, 400);
  }

  // Find or create conversation
  let conv = await c.env.DB.prepare(
    "SELECT id FROM conversation WHERE session_id = ? ORDER BY created_at DESC LIMIT 1"
  )
    .bind(sessionId)
    .first<{ id: string }>();

  let convId = conv?.id;
  const now = Date.now();
  if (!convId) {
    convId = uuidv7();
    await c.env.DB.prepare(
      "INSERT INTO conversation (id, session_id, stage, outcome, is_test, est_cost, created_at, updated_at) VALUES (?, ?, 'active', 'open', 0, 0, ?, ?)"
    )
      .bind(convId, sessionId, now, now)
      .run();
  }

  // Ensure consent record
  let consentId = body.consentId;
  if (!consentId) {
    const cRow = await c.env.DB.prepare(
      "SELECT id FROM consent_record WHERE conversation_id = ? AND decision = 1 ORDER BY recorded_at DESC LIMIT 1"
    )
      .bind(convId)
      .first<{ id: string }>();

    if (cRow) {
      consentId = cRow.id;
    } else {
      const res = await recordVisitorConsent(c.env.DB, {
        conversationId: convId,
        wordingVersion: 1,
        purpose: "lead_contact",
        decision: true
      });
      consentId = res.consentId;
    }
  }

  const result = await createLeadAndOutboxBatch(c.env.DB, c.env.NOTIFY || null, {
    conversationId: convId,
    consentId,
    intakeData: {
      name: body.name,
      email: body.email,
      serviceSlug: body.serviceSlug,
      phone: body.phone,
      currency: body.currency || "USD",
      description: body.description,
      budgetRangeId: body.budgetRangeId,
      timelineOptionId: body.timelineOptionId
    },
    source: "widget"
  });

  // Mark conversation outcome as lead_captured
  await c.env.DB.prepare("UPDATE conversation SET outcome = 'lead_captured', updated_at = ? WHERE id = ?")
    .bind(now, convId)
    .run();

  return c.json(
    {
      success: true,
      leadId: result.leadId,
      notificationId: result.notificationId,
      priority: result.priority,
      message: "Thank you! Your enquiry has been received and our team will contact you shortly."
    },
    201
  );
});

// Handover request: POST /:id/handover
sessionsRouter.post("/:id/handover", async (c) => {
  const sessionId = c.req.param("id");
  const body = await c.req.json<{ fakeTime?: string }>().catch(() => ({ fakeTime: undefined }));

  const checkDate = body?.fakeTime ? new Date(body.fakeTime) : new Date();
  const wh = isWithinPktWorkingHours(checkDate);

  if (!wh.isWithinWorkingHours) {
    return c.json(
      {
        status: "outside_hours",
        canLiveChat: false,
        message:
          "Our live staff is currently offline. TriCore working hours are Monday–Friday, 9:00 AM to 7:00 PM PKT. Please submit a callback request.",
        showCallbackForm: true
      },
      200
    );
  }

  // Inside working hours -> request handover via Conversation DO
  const doId = c.env.CONVERSATION.idFromName(sessionId);
  const convDO = c.env.CONVERSATION.get(doId);

  // Find or create conversation ID
  let conv = await c.env.DB.prepare(
    "SELECT id FROM conversation WHERE session_id = ? ORDER BY created_at DESC LIMIT 1"
  )
    .bind(sessionId)
    .first<{ id: string }>();

  const convId = conv?.id || uuidv7();
  if (!conv) {
    const now = Date.now();
    await c.env.DB.prepare(
      "INSERT INTO conversation (id, session_id, stage, outcome, is_test, est_cost, created_at, updated_at) VALUES (?, ?, 'active', 'open', 0, 0, ?, ?)"
    )
      .bind(convId, sessionId, now, now)
      .run();
  }

  const hoReq = new Request("http://internal/handover", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, conversationId: convId })
  });

  const hoRes = await convDO.fetch(hoReq);
  const hoData = (await hoRes.json()) as { handoverId: string; status: string; deadlineAt: number };

  return c.json(
    {
      status: hoData.status,
      canLiveChat: true,
      handoverId: hoData.handoverId,
      deadlineAt: hoData.deadlineAt,
      showCallbackForm: false,
      message: "Connecting you with our team. A specialist can join within 3 minutes."
    },
    200
  );
});

// Handover status poll: GET /:id/handover
sessionsRouter.get("/:id/handover", async (c) => {
  const sessionId = c.req.param("id");
  const ho = await c.env.DB.prepare(
    `SELECT h.* FROM handover_request h
     JOIN conversation conv ON conv.id = h.conversation_id
     WHERE conv.session_id = ?
     ORDER BY h.requested_at DESC LIMIT 1`
  )
    .bind(sessionId)
    .first<{ id: string; status: string; deadline_at: number }>();

  if (!ho) {
    return c.json({ status: "none", showCallbackForm: false });
  }

  if (ho.status === "timed_out") {
    return c.json({
      status: "timed_out",
      showCallbackForm: true,
      message: "All specialists are currently assisting other clients. Please submit a callback request so we can call you back."
    });
  }

  return c.json({
    status: ho.status,
    handoverId: ho.id,
    deadlineAt: ho.deadline_at,
    showCallbackForm: false
  });
});

// Alarm trigger for timeout simulation: POST /:id/alarm
sessionsRouter.post("/:id/alarm", async (c) => {
  const sessionId = c.req.param("id");
  const doId = c.env.CONVERSATION.idFromName(sessionId);
  const convDO = c.env.CONVERSATION.get(doId);
  const res = await convDO.fetch("http://internal/alarm", { method: "POST" });
  const data = await res.json();
  return c.json(data);
});
