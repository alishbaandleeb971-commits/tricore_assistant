import { Hono } from "hono";
import { uuidv7 } from "uuidv7";
import { verifyTurnstileToken, hashToken } from "../services/turnstile.js";

export type SessionEnv = {
  Bindings: {
    DB: D1Database;
    CONVERSATION: DurableObjectNamespace;
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
