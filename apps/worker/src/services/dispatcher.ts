export interface NotificationPayload {
  leadId: string;
  conversationId?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  service: string;
  priority: "hot" | "warm" | "cold";
  currency: string;
  description?: string | null;
  source: string;
  createdAt?: number;
}

export interface DispatchResult {
  status: "sent" | "failed" | "undeliverable";
  error?: string;
}

export interface CapturedDispatch {
  type: "email" | "slack";
  toOrUrl: string;
  subjectOrText: string;
  body?: string;
  capturedAt: number;
}

export const capturedDispatches: CapturedDispatch[] = [];

export function clearCapturedDispatches(): void {
  capturedDispatches.length = 0;
}

/**
 * Format timestamp into Pakistan Standard Time (PKT, UTC+5).
 */
export function formatPktTime(timestampMs: number): string {
  const d = new Date(timestampMs);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
  return `${formatter.format(d)} PKT`;
}

/**
 * Build escaped, structured email content for lead and callback alerts.
 */
export function buildEmailContent(data: NotificationPayload): { subject: string; body: string } {
  const isHot = data.priority === "hot";
  const subjectPrefix = isHot ? "🔥 HOT LEAD ALERT" : "New Lead Captured";
  const subject = `${subjectPrefix}: ${data.name} (${data.service})`;

  const staffUrl = data.conversationId
    ? `https://tricoredigitaltech.com/staff/conversations/${data.conversationId}`
    : `https://tricoredigitaltech.com/staff/leads/${data.leadId}`;

  const timePkt = formatPktTime(data.createdAt || Date.now());

  const body = [
    isHot ? "🔥 ATTENTION: This is a HOT LEAD requiring immediate response!" : "A new lead has been submitted via the website assistant.",
    "",
    `Lead ID: ${data.leadId}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone ? data.phone : "Not provided"}`,
    `Interested Service: ${data.service}`,
    `Priority: ${data.priority.toUpperCase()}`,
    `Source: ${data.source}`,
    `Time: ${timePkt}`,
    "",
    `Requirements Summary: ${data.description ? data.description : "None provided"}`,
    "",
    `Staff Portal Link (Sign-in required): ${staffUrl}`
  ].join("\n");

  return { subject, body };
}

/**
 * Build escaped, structured Slack message content for lead and callback alerts.
 */
export function buildSlackContent(data: NotificationPayload): string {
  const isHot = data.priority === "hot";
  const staffUrl = data.conversationId
    ? `https://tricoredigitaltech.com/staff/conversations/${data.conversationId}`
    : `https://tricoredigitaltech.com/staff/leads/${data.leadId}`;

  const timePkt = formatPktTime(data.createdAt || Date.now());
  const header = isHot
    ? "🔥 <!here> *HOT LEAD ALERT*"
    : "📬 *New Lead Captured*";

  return [
    header,
    `*Name:* ${data.name}`,
    `*Email:* ${data.email}`,
    `*Phone:* ${data.phone ? data.phone : "Not provided"}`,
    `*Service:* ${data.service}`,
    `*Priority:* ${data.priority.toUpperCase()}`,
    `*Source:* ${data.source}`,
    `*Time:* ${timePkt}`,
    `*Summary:* ${data.description ? data.description : "None provided"}`,
    `*View in Staff App:* <${staffUrl}|Open Conversation>`
  ].join("\n");
}

export const fakeEmailSend = async (to: string, subject: string, body: string): Promise<boolean> => {
  // Console log in local dev so developers/testers can inspect full rendered output
  console.log(`\n=== [LOCAL FAKE EMAIL SENT to ${to}] ===\nSUBJECT: ${subject}\n\n${body}\n=========================================\n`);
  capturedDispatches.push({
    type: "email",
    toOrUrl: to,
    subjectOrText: subject,
    body,
    capturedAt: Date.now()
  });
  return true;
};

export const fakeSlackPost = async (webhookUrl: string, payload: unknown): Promise<boolean> => {
  const text =
    typeof payload === "object" && payload !== null && "text" in payload
      ? String((payload as { text: unknown }).text)
      : JSON.stringify(payload);

  // Console log in local dev so developers/testers can inspect full rendered output
  console.log(`\n=== [LOCAL FAKE SLACK POST to ${webhookUrl}] ===\n${text}\n==============================================\n`);
  capturedDispatches.push({
    type: "slack",
    toOrUrl: webhookUrl,
    subjectOrText: text,
    capturedAt: Date.now()
  });
  return true;
};

export async function dispatchNotificationRow(
  row: { id: string; channel: string; payload: string; attempts: number },
  adapters?: {
    emailSend?: (to: string, subject: string, body: string) => Promise<boolean>;
    slackPost?: (webhookUrl: string, body: unknown) => Promise<boolean>;
  },
  env?: { SLACK_WEBHOOK_URL?: string }
): Promise<DispatchResult> {
  let data: NotificationPayload;
  try {
    data = JSON.parse(row.payload);
  } catch {
    return { status: "undeliverable", error: "malformed_json_payload" };
  }

  if (row.channel === "email") {
    const { subject, body } = buildEmailContent(data);
    const emailSender = adapters?.emailSend || fakeEmailSend;
    const success = await emailSender("Info@tricoredigitaltech.com", subject, body);
    if (!success) {
      return { status: "failed", error: "email_adapter_rejected" };
    }
    return { status: "sent" };
  }

  if (row.channel === "slack") {
    const text = buildSlackContent(data);
    const slackSender = adapters?.slackPost || fakeSlackPost;
    const webhookUrl = env?.SLACK_WEBHOOK_URL || "https://hooks.slack.com/services/DUMMY/SLACK/WEBHOOK";
    const success = await slackSender(webhookUrl, { text });
    if (!success) {
      return { status: "failed", error: "slack_adapter_rejected" };
    }
    return { status: "sent" };
  }

  return { status: "undeliverable", error: `unsupported_channel_${row.channel}` };
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

  const { subject, body } = buildEmailContent(data);
  const emailSender = adapters?.emailSend || fakeEmailSend;
  const emailOk = await emailSender("Info@tricoredigitaltech.com", subject, body);

  const text = buildSlackContent(data);
  const slackSender = adapters?.slackPost || fakeSlackPost;
  const webhookUrl = env?.SLACK_WEBHOOK_URL || "https://hooks.slack.com/services/DUMMY/SLACK/WEBHOOK";
  const slackOk = await slackSender(webhookUrl, { text });

  if (emailOk && slackOk) {
    return { status: "sent" };
  }
  return { status: "failed", error: "one_or_more_adapters_failed" };
}

/**
 * Queue Batch Processor:
 * Status progression: pending -> sending -> sent | undeliverable
 * Row is only marked 'sent' after adapter call returns success.
 * If adapter returns failure or throws:
 *   - attempts is incremented by 1
 *   - if attempts >= 5: status = 'undeliverable'
 *   - else: status = 'pending' (ready for Queue retry / backoff)
 */
export async function processQueueBatch(
  batch: MessageBatch<unknown>,
  db: D1Database,
  adapters?: {
    emailSend?: (to: string, subject: string, body: string) => Promise<boolean>;
    slackPost?: (webhookUrl: string, body: unknown) => Promise<boolean>;
  },
  env?: { SLACK_WEBHOOK_URL?: string }
): Promise<void> {
  for (const msg of batch.messages) {
    const body = msg.body as { notificationId: string };
    if (!body?.notificationId) {
      msg.ack();
      continue;
    }

    // 1. Claim row: transition pending -> sending (conditional update)
    // Only claim if currently 'pending' (or 'failed' during retry) and not already 'sending' or 'sent'
    const claimRes = await db
      .prepare(
        "UPDATE notification SET status = 'sending' WHERE id = ? AND status IN ('pending', 'failed')"
      )
      .bind(body.notificationId)
      .run();

    // If row could not be claimed (e.g. duplicate queue message or already sent), ack and skip
    if (!claimRes.meta || claimRes.meta.changes === 0) {
      msg.ack();
      continue;
    }

    // 2. Fetch notification row
    const notif = await db
      .prepare("SELECT * FROM notification WHERE id = ?")
      .bind(body.notificationId)
      .first<{ id: string; channel: string; payload: string; attempts: number }>();

    if (!notif) {
      msg.ack();
      continue;
    }

    // 3. Dispatch to adapter
    let dispatchRes: DispatchResult;
    try {
      dispatchRes = await dispatchNotificationRow(notif, adapters, env);
    } catch (err: unknown) {
      dispatchRes = { status: "failed", error: String(err) };
    }

    const nextAttempts = notif.attempts + 1;

    // 4. Update status according to result
    if (dispatchRes.status === "sent") {
      await db
        .prepare("UPDATE notification SET status = 'sent', attempts = ? WHERE id = ?")
        .bind(nextAttempts, notif.id)
        .run();
      msg.ack();
    } else {
      if (nextAttempts >= 5 || dispatchRes.status === "undeliverable") {
        await db
          .prepare("UPDATE notification SET status = 'undeliverable', attempts = ? WHERE id = ?")
          .bind(nextAttempts, notif.id)
          .run();
        msg.ack();
      } else {
        // Temporary failure: reset to 'pending' so next retry can claim it
        await db
          .prepare("UPDATE notification SET status = 'pending', attempts = ? WHERE id = ?")
          .bind(nextAttempts, notif.id)
          .run();
        msg.retry();
      }
    }
  }
}
