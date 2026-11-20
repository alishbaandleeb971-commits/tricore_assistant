import { uuidv7 } from "uuidv7";

export interface CronSweepResult {
  recoveredCount: number;
  heartbeatRecorded: boolean;
}

export async function runCronSweep(
  db: D1Database,
  queue: Queue | null
): Promise<CronSweepResult> {
  const now = Date.now();
  const twoMinutesAgo = now - 120_000;

  // 1. Recover pending or failed outbox rows older than 2 minutes
  const stuckRows = await db
    .prepare(
      `SELECT id, dedupe_key, attempts FROM notification
       WHERE status IN ('pending', 'failed') AND created_at <= ? AND attempts < 5
       LIMIT 20`
    )
    .bind(twoMinutesAgo)
    .all<{ id: string; dedupe_key: string; attempts: number }>();

  let recoveredCount = 0;
  if (stuckRows.results && stuckRows.results.length > 0) {
    for (const row of stuckRows.results) {
      if (queue) {
        await queue.send({ notificationId: row.id, dedupeKey: row.dedupe_key }).catch(() => {});
      }
      recoveredCount++;
    }
  }

  // 2. Write heartbeat to job_run
  const jobId = uuidv7();
  await db
    .prepare("INSERT INTO job_run (id, job, status, ran_at) VALUES (?, 'every_minute_sweep', 'completed', ?)")
    .bind(jobId, now)
    .run();

  return {
    recoveredCount,
    heartbeatRecorded: true
  };
}
