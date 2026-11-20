import { Hono } from "hono";
import { uuidv7 } from "uuidv7";

export interface CallbackRequestPayload {
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  note?: string;
}

export type CallbackEnv = {
  Bindings: {
    DB: D1Database;
    NOTIFY: Queue;
  };
};

export const callbackRouter = new Hono<CallbackEnv>();

callbackRouter.post("/:id/callback", async (c) => {
  const sessionId = c.req.param("id");
  const body = await c.req.json<CallbackRequestPayload>().catch(() => null);

  if (!body || !body.contactName || (!body.contactEmail && !body.contactPhone)) {
    return c.json(
      { error: "invalid_callback_data", message: "Name and either email or phone are required." },
      400
    );
  }

  const callbackId = uuidv7();
  const leadId = uuidv7();
  const notificationId = uuidv7();
  const now = Date.now();

  // Look up conversation for this session if one exists
  const conv = await c.env.DB.prepare(
    "SELECT id FROM conversation WHERE session_id = ? ORDER BY created_at DESC LIMIT 1"
  )
    .bind(sessionId)
    .first<{ id: string }>();

  const convId = conv?.id || null;

  // Single atomic batch: lead (first to satisfy FK) + callback_request + urgent outbox alert
  const notifPayload = JSON.stringify({
    leadId,
    name: body.contactName,
    email: body.contactEmail || "",
    phone: body.contactPhone || "",
    service: "General Callback Inquiry",
    priority: "hot",
    currency: "USD",
    source: "callback",
    description: body.note || "Visitor requested callback"
  });

  await c.env.DB.batch([
    c.env.DB.prepare(
      `INSERT INTO lead (id, conversation_id, name, email, phone, currency, description, priority, source, created_at)
       VALUES (?, ?, ?, ?, ?, 'USD', ?, 'hot', 'callback', ?)`
    ).bind(
      leadId,
      convId,
      body.contactName,
      body.contactEmail || null,
      body.contactPhone || null,
      body.note || null,
      now
    ),

    c.env.DB.prepare(
      `INSERT INTO callback_request (id, conversation_id, lead_id, contact_name, contact_email, contact_phone, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      callbackId,
      convId,
      leadId,
      body.contactName,
      body.contactEmail || null,
      body.contactPhone || null,
      body.note || null,
      now
    ),

    c.env.DB.prepare(
      `INSERT INTO notification (id, event_type, channel, dedupe_key, payload, status, attempts, created_at)
       VALUES (?, 'lead_alert', 'email', ?, ?, 'pending', 0, ?)`
    ).bind(notificationId, `callback:${callbackId}`, notifPayload, now)
  ]);

  if (c.env.NOTIFY) {
    await c.env.NOTIFY.send({ notificationId, leadId, priority: "hot" }).catch(() => {});
  }

  return c.json(
    {
      success: true,
      callbackId,
      message: "Thank you! Our team has received your callback request and will contact you shortly."
    },
    201
  );
});
