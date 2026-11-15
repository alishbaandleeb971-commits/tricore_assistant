import { describe, it, expect } from "vitest";
import { checkRateLimit, RATE_LIMITS } from "../src/services/rateLimiter";
import { env } from "cloudflare:test";

describe("Rate Limiter Service (TASK-012)", () => {
  it("rejects payload exceeding 1000 characters with payload_too_large", async () => {
    const res = await checkRateLimit(env.DB, "sess-1", 1001);
    expect(res.allowed).toBe(false);
    expect(res.reason).toBe("payload_too_large");
  });

  it("enforces 10 messages per minute limit and provides retryAfterSeconds", async () => {
    const sessId = "sess-flood-1";
    for (let i = 0; i < RATE_LIMITS.MAX_PER_MINUTE; i++) {
      const res = await checkRateLimit(env.DB, sessId, 50);
      expect(res.allowed).toBe(true);
    }

    // 11th call in same minute window
    const blocked = await checkRateLimit(env.DB, sessId, 50);
    expect(blocked.allowed).toBe(false);
    expect(blocked.reason).toBe("minute_limit_exceeded");
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });
});
