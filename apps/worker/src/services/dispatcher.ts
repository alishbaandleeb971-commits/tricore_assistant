export interface NotificationPayload {
  leadId: string;
  name: string;
  email: string;
  phone?: string | null;
  service: string;
  priority: "hot" | "warm" | "cold";
  currency: string;
  description?: string | null;
  source: string;
}

export interface DispatchResult {
  status: "delivered" | "failed" | "undeliverable";
  error?: string;
}

export async function dispatchNotification(
  payloadStr: string,
  adapters?: {
    emailSend?: (to: string, subject: string, body: string) => Promise<boolean>;
    slackPost?: (webhookUrl: string, body: unknown) => Promise<boolean>;
  },
  env?: { SLACK_WEBHOOK_URL?: string }
): Promise<DispatchResult> {
  let data: NotificationPayload;
  try {
    data = JSON.parse(payloadStr);
  } catch {
    return { status: "undeliverable", error: "malformed_json_payload" };
  }

  const subjectPrefix = data.priority === "hot" ? "🔥 HOT LEAD ALERT" : "New Lead Captured";
  const subject = `${subjectPrefix}: ${data.name} (${data.service})`;
  const bodyText = `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Service: ${data.service}
Priority: ${data.priority.toUpperCase()}
Source: ${data.source}
Notes: ${data.description || "None"}
  `.trim();

  // 1. Dispatch Email
  if (adapters?.emailSend) {
    const success = await adapters.emailSend("team@tricoredigitaltech.com", subject, bodyText);
    if (!success) {
      return { status: "failed", error: "email_adapter_rejected" };
    }
  }

  // 2. Dispatch Slack if configured
  if (adapters?.slackPost && env?.SLACK_WEBHOOK_URL) {
    const success = await adapters.slackPost(env.SLACK_WEBHOOK_URL, {
      text: `${subject}\n${bodyText}`
    });
    if (!success) {
      return { status: "failed", error: "slack_adapter_rejected" };
    }
  }

  return { status: "delivered" };
}

export async function processQueueBatch(
  batch: MessageBatch<any>,
  db: D1Database,
  adapters?: {
    emailSend?: (to: string, subject: string, body: string) => Promise<boolean>;
    slackPost?: (webhookUrl: string, body: unknown) => Promise<boolean>;
  },
  env?: { SLACK_WEBHOOK_URL?: string }
): Promise<void> {
  for (const msg of batch.messages) {
    const body = msg.body as { notificationId: string };
    const notif = await db
      .prepare("SELECT * FROM notification WHERE id = ?")
      .bind(body.notificationId)
      .first<{ id: string; payload: string; attempts: number }>();

    if (!notif) {
      msg.ack();
      continue;
    }

    const res = await dispatchNotification(notif.payload, adapters, env);

    if (res.status === "delivered") {
      await db
        .prepare("UPDATE notification SET status = 'delivered' WHERE id = ?")
        .bind(notif.id)
        .run();
      msg.ack();
    } else if (notif.attempts >= 4) {
      // 5th attempt failed -> mark undeliverable
      await db
        .prepare("UPDATE notification SET status = 'undeliverable', attempts = attempts + 1 WHERE id = ?")
        .bind(notif.id)
        .run();
      msg.ack();
    } else {
      await db
        .prepare("UPDATE notification SET status = 'failed', attempts = attempts + 1 WHERE id = ?")
        .bind(notif.id)
        .run();
      msg.retry();
    }
  }
}
