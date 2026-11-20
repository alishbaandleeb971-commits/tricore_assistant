export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
  reason?: "minute_limit_exceeded" | "session_limit_exceeded" | "payload_too_large";
}

export const RATE_LIMITS = {
  MAX_PER_MINUTE: 10,
  MAX_PER_SESSION: 40,
  MAX_PAYLOAD_LENGTH: 1000
};

export async function checkRateLimit(
  db: D1Database,
  sessionId: string,
  contentLength: number
): Promise<RateLimitResult> {
  // 1. Check content length
  if (contentLength > RATE_LIMITS.MAX_PAYLOAD_LENGTH) {
    return {
      allowed: false,
      reason: "payload_too_large"
    };
  }

  const now = Date.now();
  const minuteWindow = Math.floor(now / 60000);
  const minKey = `rate:min:${sessionId}:${minuteWindow}`;
  const sessKey = `rate:sess:${sessionId}`;

  // 2. Increment & check minute counter in D1 rate_counter
  const minRes = await db
    .prepare(
      `INSERT INTO rate_counter (counter_key, count, expires_at)
       VALUES (?, 1, ?)
       ON CONFLICT(counter_key) DO UPDATE SET count = count + 1
       RETURNING count`
    )
    .bind(minKey, now + 65000)
    .first<{ count: number }>();

  if (minRes && minRes.count > RATE_LIMITS.MAX_PER_MINUTE) {
    return {
      allowed: false,
      retryAfterSeconds: 60 - Math.floor((now % 60000) / 1000),
      reason: "minute_limit_exceeded"
    };
  }

  // 3. Increment & check total session counter
  const sessRes = await db
    .prepare(
      `INSERT INTO rate_counter (counter_key, count, expires_at)
       VALUES (?, 1, ?)
       ON CONFLICT(counter_key) DO UPDATE SET count = count + 1
       RETURNING count`
    )
    .bind(sessKey, now + 86400000)
    .first<{ count: number }>();

  if (sessRes && sessRes.count > RATE_LIMITS.MAX_PER_SESSION) {
    return {
      allowed: false,
      retryAfterSeconds: 3600,
      reason: "session_limit_exceeded"
    };
  }

  return { allowed: true };
}
