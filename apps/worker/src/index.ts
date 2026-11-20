import { Hono } from "hono";
import { sessionsRouter } from "./routes/sessions.js";
import { callbackRouter } from "./routes/callback.js";
import { staffRouter } from "./routes/staff.js";
import { knowledgeRouter } from "./routes/knowledge.js";

export type Env = {
  Bindings: {
    DB: D1Database;
    CONVERSATION: DurableObjectNamespace;
    STAFF_HUB: DurableObjectNamespace;
    NOTIFY: Queue;
    BACKUPS: R2Bucket;
    EMAIL: SendEmail;
    ASSETS: Fetcher;
    ENVIRONMENT?: string;
    TURNSTILE_SECRET?: string;
  };
};

const app = new Hono<Env>();

app.get("/healthz", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "0.1.0"
  });
});

app.get("/readyz", async (c) => {
  try {
    const result = await c.env.DB.prepare("SELECT 1 as alive").first<{ alive: number }>();
    if (result && result.alive === 1) {
      return c.json({
        status: "ok",
        database: "connected",
        timestamp: new Date().toISOString()
      });
    }
    return c.json({ status: "error", error: "Database probe returned unexpected result" }, 503);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return c.json({ status: "error", error: message }, 503);
  }
});

// Mount public sessions API
app.route("/api/v1/public/sessions", sessionsRouter);
app.route("/api/v1/public/sessions", callbackRouter);
app.route("/api/v1/staff", staffRouter);
app.route("/api/v1/staff/knowledge", knowledgeRouter);

export { ConversationDO, StaffHubDO } from "./durable/conversation.js";

export default app;
