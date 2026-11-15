import { describe, it, expect } from "vitest";
import { checkAndRecordSpend } from "../src/services/budgetGate";
import { env } from "cloudflare:test";

describe("AI Monthly Budget Gate (TASK-015)", () => {
  it("tracks spend, triggers 80% warning alert, and stops at $100 cap", async () => {
    // 1. Initial spend within normal limits
    const res1 = await checkAndRecordSpend(env.DB, 10_000_000); // $10
    expect(res1.allowed).toBe(true);
    expect(res1.warningTriggered).toBe(false);

    // 2. Spend crossing 80% ($80 threshold)
    const res2 = await checkAndRecordSpend(env.DB, 71_000_000); // reaches $81
    expect(res2.allowed).toBe(true);
    expect(res2.warningTriggered).toBe(true);

    // 3. Second spend above 80% does not re-trigger warning
    const res3 = await checkAndRecordSpend(env.DB, 5_000_000); // reaches $86
    expect(res3.allowed).toBe(true);
    expect(res3.warningTriggered).toBe(false);

    // 4. Spend attempting to cross $100 hard limit
    const res4 = await checkAndRecordSpend(env.DB, 20_000_000); // would reach $106
    expect(res4.allowed).toBe(false);
  });
});
