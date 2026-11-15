import { uuidv7 } from "uuidv7";

export interface RetentionCleanupResult {
  deletedConversations: number;
  deletedMessages: number;
  batchCount: number;
}

/**
 * Scheduled daily data retention cleanup (BR-027, FR-152, FR-153):
 * - Deletes anonymous conversations older than 90 days in batches of 500
 * - Records deleted count in `deletion_log`
 */
export async function runDailyRetentionCleanup(
  db: D1Database,
  maxBatches = 5
): Promise<RetentionCleanupResult> {
  const now = Date.now();
  const ninetyDaysAgo = now - 90 * 86400_000;

  let totalDeletedConv = 0;
  let totalDeletedMsg = 0;
  let batchesRun = 0;

  for (let i = 0; i < maxBatches; i++) {
    // Select up to 500 expired conversation IDs
    const expired = await db
      .prepare(
        `SELECT id FROM conversation
         WHERE updated_at < ? AND outcome != 'lead_captured'
         LIMIT 500`
      )
      .bind(ninetyDaysAgo)
      .all<{ id: string }>();

    if (!expired.results || expired.results.length === 0) {
      break;
    }

    const ids = expired.results.map((r) => r.id);
    const placeholders = ids.map(() => "?").join(",");

    // Delete linked messages first
    const msgDel = await db
      .prepare(`DELETE FROM message WHERE conversation_id IN (${placeholders})`)
      .bind(...ids)
      .run();

    // Delete conversations
    const convDel = await db
      .prepare(`DELETE FROM conversation WHERE id IN (${placeholders})`)
      .bind(...ids)
      .run();

    const deletedMsgs = msgDel.meta?.changes || ids.length;
    const deletedConvs = convDel.meta?.changes || ids.length;

    totalDeletedMsg += deletedMsgs;
    totalDeletedConv += deletedConvs;
    batchesRun++;

    // Record in deletion_log
    const logId = uuidv7();
    await db
      .prepare(
        "INSERT INTO deletion_log (id, category, deleted_count, deleted_at) VALUES (?, 'expired_conversations', ?, ?)"
      )
      .bind(logId, deletedConvs, now)
      .run();

    if (ids.length < 500) {
      break;
    }
  }

  return {
    deletedConversations: totalDeletedConv,
    deletedMessages: totalDeletedMsg,
    batchCount: batchesRun
  };
}
