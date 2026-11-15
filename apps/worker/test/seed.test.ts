import { describe, it, expect } from "vitest";
import { env } from "cloudflare:test";

describe("Database Seed Verification (TASK-007)", () => {
  it("verifies seed script outputs expected service count (8 official services)", async () => {
    // 1. Verify 8 official services
    const services = await env.DB.prepare("SELECT count(*) as count FROM service").first<{ count: number }>();
    expect(services?.count).toBe(8);

    // 2. Verify budget ranges (4 USD + 4 PKR = 8 total)
    const budgets = await env.DB.prepare("SELECT count(*) as count FROM budget_range").first<{ count: number }>();
    expect(budgets?.count).toBe(8);

    // 3. Verify timeline options (5 from settings_seed.json)
    const timelines = await env.DB.prepare("SELECT count(*) as count FROM timeline_option").first<{ count: number }>();
    expect(timelines?.count).toBe(5);

    // 4. Verify seeded knowledge chunks and FTS5 search
    const chunks = await env.DB.prepare("SELECT count(*) as count FROM knowledge_chunk").first<{ count: number }>();
    expect(chunks?.count).toBeGreaterThanOrEqual(40);

    const ftsSearch = await env.DB.prepare(
      "SELECT count(*) as count FROM knowledge_fts WHERE knowledge_fts MATCH 'AI'"
    ).first<{ count: number }>();
    expect(ftsSearch?.count).toBeGreaterThan(0);
  });
});
