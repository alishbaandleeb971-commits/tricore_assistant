import { Hono } from "hono";
import { uuidv7 } from "uuidv7";
import { verifyTurnstileToken, hashToken } from "../services/turnstile.js";

export type SessionEnv = {
  Bindings: {
    DB: D1Database;
    TURNSTILE_SECRET?: string;
  };
};

export const sessionsRouter = new Hono<SessionEnv>();

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
