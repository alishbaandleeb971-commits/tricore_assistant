export interface BudgetCheckResult {
  allowed: boolean;
  warningTriggered: boolean;
  totalSpentMicro: number;
}

export const MONTHLY_SPEND_LIMIT_MICRO = 100_000_000; // $100.00 USD in micro-dollars
export const WARNING_THRESHOLD_MICRO = 80_000_000; // $80.00 USD (80%)

export async function checkAndRecordSpend(
  db: D1Database,
  estimatedCostMicro: number,
  isTest = false
): Promise<BudgetCheckResult> {
  const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

  // Ensure record exists
  await db
    .prepare(
      `INSERT OR IGNORE INTO spend_month (month, real_spent_micro, reserved_micro, test_spent_micro, warning_sent)
       VALUES (?, 0, 0, 0, 0)`
    )
    .bind(currentMonth)
    .run();

  const record = await db
    .prepare("SELECT * FROM spend_month WHERE month = ?")
    .bind(currentMonth)
    .first<{
      real_spent_micro: number;
      test_spent_micro: number;
      warning_sent: number;
    }>();

  const currentReal = record?.real_spent_micro ?? 0;
  if (!isTest && currentReal + estimatedCostMicro > MONTHLY_SPEND_LIMIT_MICRO) {
    return {
      allowed: false,
      warningTriggered: false,
      totalSpentMicro: currentReal
    };
  }

  // Increment spend
  const fieldToUpdate = isTest ? "test_spent_micro" : "real_spent_micro";
  const updated = await db
    .prepare(
      `UPDATE spend_month
       SET ${fieldToUpdate} = ${fieldToUpdate} + ?
       WHERE month = ?
       RETURNING real_spent_micro, warning_sent`
    )
    .bind(estimatedCostMicro, currentMonth)
    .first<{ real_spent_micro: number; warning_sent: number }>();

  const newReal = updated?.real_spent_micro ?? currentReal;
  let warningTriggered = false;

  if (newReal >= WARNING_THRESHOLD_MICRO && updated?.warning_sent === 0) {
    await db
      .prepare("UPDATE spend_month SET warning_sent = 1 WHERE month = ?")
      .bind(currentMonth)
      .run();
    warningTriggered = true;
  }

  return {
    allowed: true,
    warningTriggered,
    totalSpentMicro: newReal
  };
}
