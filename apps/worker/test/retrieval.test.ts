import { describe, it, expect } from "vitest";
import { retrieveKnowledgeChunks } from "../src/services/retrieval";
import { env } from "cloudflare:test";

describe("SQLite FTS5 Knowledge Retrieval Service (TASK-013)", () => {
  it("retrieves top matching chunks with bm25 ranking for exact and keyword terms", async () => {
    const results = await retrieveKnowledgeChunks(env.DB, "AI Services and chatbot", 4);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBeDefined();
    expect(results[0].body).toBeDefined();
    expect(results[0].score).toBeDefined();
  });

  it("returns empty array for empty or whitespace query", async () => {
    const results = await retrieveKnowledgeChunks(env.DB, "    ", 4);
    expect(results).toEqual([]);
  });
});
