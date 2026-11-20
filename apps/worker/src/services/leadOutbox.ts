import { uuidv7 } from "uuidv7";
import { LeadIntakeData } from "@tricore/shared";
import { calculateLeadPriority } from "@tricore/shared";

export interface CreateLeadAndOutboxParams {
  conversationId: string;
  consentId: string;
  intakeData: LeadIntakeData;
  source?: string;
}

export interface CreateLeadAndOutboxResult {
  leadId: string;
  emailNotificationId: string;
  slackNotificationId: string;
  priority: string;
}

export async function createLeadAndOutboxBatch(
  db: D1Database,
  queue: Queue | null,
  params: CreateLeadAndOutboxParams
): Promise<CreateLeadAndOutboxResult> {
  const leadId = uuidv7();
  const emailNotificationId = uuidv7();
  const slackNotificationId = uuidv7();
  const now = Date.now();

  // 1. Fetch budget and timeline info for scoring
  let budgetMeetsHot = false;
  if (params.intakeData.budgetRangeId) {
    const bRow = await db
      .prepare("SELECT meets_hot_threshold FROM budget_range WHERE id = ?")
      .bind(params.intakeData.budgetRangeId)
      .first<{ meets_hot_threshold: number }>();
    budgetMeetsHot = bRow?.meets_hot_threshold === 1;
  }

  let timelineWithin3 = false;
  if (params.intakeData.timelineOptionId) {
    const tRow = await db
      .prepare("SELECT within_3_months FROM timeline_option WHERE id = ?")
      .bind(params.intakeData.timelineOptionId)
      .first<{ timeline_option_id: string; within_3_months: number }>();
    timelineWithin3 = tRow?.within_3_months === 1;
  }

  // 2. Score priority
  const priority = calculateLeadPriority({
    hasName: Boolean(params.intakeData.name),
    hasEmail: Boolean(params.intakeData.email),
    hasService: Boolean(params.intakeData.serviceSlug),
    hasPhone: Boolean(params.intakeData.phone),
    budgetMeetsHotThreshold: budgetMeetsHot,
    timelineWithin3Months: timelineWithin3
  });

  // 3. Resolve service ID
  const sRow = await db
    .prepare("SELECT id FROM service WHERE slug = ?")
    .bind(params.intakeData.serviceSlug)
    .first<{ id: string }>();

  const serviceId = sRow?.id;

  const payload = JSON.stringify({
    leadId,
    conversationId: params.conversationId,
    name: params.intakeData.name,
    email: params.intakeData.email,
    phone: params.intakeData.phone,
    service: params.intakeData.serviceSlug,
    priority,
    currency: params.intakeData.currency,
    description: params.intakeData.description,
    source: params.source || "assistant",
    createdAt: now
  });

  // Dedupe key per SDD §10.5: event type + record id + version + channel
  const emailDedupeKey = `lead:${leadId}:v1:email`;
  const slackDedupeKey = `lead:${leadId}:v1:slack`;

  // 4. Atomic D1 Batch: Lead + Lead_Service + 2 Outbox Notifications (Email + Slack)
  const batchStatements: D1PreparedStatement[] = [
    db.prepare(
      `INSERT INTO lead (id, conversation_id, consent_id, name, email, phone, budget_range_id, timeline_option_id, currency, description, priority, source, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      leadId,
      params.conversationId,
      params.consentId,
      params.intakeData.name,
      params.intakeData.email,
      params.intakeData.phone || null,
      params.intakeData.budgetRangeId || null,
      params.intakeData.timelineOptionId || null,
      params.intakeData.currency || "USD",
      params.intakeData.description || null,
      priority,
      params.source || "assistant",
      now
    ),

    // Outbox Row 1: Email
    db.prepare(
      `INSERT INTO notification (id, event_type, channel, dedupe_key, payload, status, attempts, created_at)
       VALUES (?, 'lead_alert', 'email', ?, ?, 'pending', 0, ?)`
    ).bind(emailNotificationId, emailDedupeKey, payload, now),

    // Outbox Row 2: Slack
    db.prepare(
      `INSERT INTO notification (id, event_type, channel, dedupe_key, payload, status, attempts, created_at)
       VALUES (?, 'lead_alert', 'slack', ?, ?, 'pending', 0, ?)`
    ).bind(slackNotificationId, slackDedupeKey, payload, now)
  ];

  if (serviceId) {
    batchStatements.push(
      db.prepare(
        `INSERT OR IGNORE INTO lead_service (lead_id, service_id) VALUES (?, ?)`
      ).bind(leadId, serviceId)
    );
  }

  await db.batch(batchStatements);

  // 5. Send messages to notifications Queue for both channels
  if (queue) {
    await Promise.allSettled([
      queue.send({ notificationId: emailNotificationId, dedupeKey: emailDedupeKey }),
      queue.send({ notificationId: slackNotificationId, dedupeKey: slackDedupeKey })
    ]);
  }

  return {
    leadId,
    emailNotificationId,
    slackNotificationId,
    priority
  };
}
