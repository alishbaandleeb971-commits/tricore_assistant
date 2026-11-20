import { uuidv7 } from "uuidv7";

export interface QuotaSnapshot {
  id: string;
  takenAt: number;
  metric: string;
  value: number;
  dailyLimit: number;
}

export async function captureHourlyQuotaSnapshot(
  db: D1Database,
  metric: string,
  currentValue: number,
  dailyLimit: number
): Promise<{ snapshotId: string; warningNeeded: boolean }> {
  const snapshotId = uuidv7();
  const now = Date.now();

  await db
    .prepare(
      `INSERT INTO usage_snapshot (id, taken_at, metric, value, daily_limit)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(snapshotId, now, metric, currentValue, dailyLimit)
    .run();

  const usageRatio = currentValue / dailyLimit;
  const warningNeeded = usageRatio >= 0.6; // 60% free-tier cap alert threshold

  return {
    snapshotId,
    warningNeeded
  };
}
