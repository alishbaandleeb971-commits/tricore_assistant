import { describe, it, expect } from "vitest";
import { ConversationDO } from "../src/durable/conversation";
import { env } from "cloudflare:test";

describe("Conversation Durable Object State Machine (TASK-017)", () => {
  it("handles multi-turn chat, answers from dummy content, and refuses prices", async () => {
    const doState = {
      storage: {
        get: async () => null,
        put: async () => {}
      }
    } as unknown as DurableObjectState;

    // Seed session row in D1 to satisfy foreign key constraint
    const now = Date.now();
    await env.DB.prepare(
      "INSERT INTO visitor_session (id, token_hash, created_at, last_seen_at) VALUES (?, 'dummy-hash', ?, ?)"
    )
      .bind("sess-test-1", now, now)
      .run();

    const convDO = new ConversationDO(doState, env);
    await convDO.init("conv-test-1", "sess-test-1");

    // Turn 1: Service Inquiry
    const turn1 = await convDO.handleTurn({
      content: "What AI services do you offer?"
    });

    expect(turn1.seq).toBe(2);
    expect(turn1.reply).toBeDefined();
    expect(turn1.intent).toBe("service_inquiry");
    expect(turn1.usedChunkIds.length).toBeGreaterThan(0);

    // Turn 2: Price Inquiry (Must refuse to invent price)
    const turn2 = await convDO.handleTurn({
      content: "How much does it cost? Quote me $500"
    });

    expect(turn2.intent).toBe("pricing_inquiry");
    expect(turn2.reply).toContain("custom");
    expect(turn2.reply).not.toContain("$500");

    // Verify D1 records persisted in single batch
    const messages = await env.DB.prepare(
      "SELECT * FROM message WHERE conversation_id = ? ORDER BY seq ASC"
    )
      .bind("conv-test-1")
      .all();

    expect(messages.results.length).toBe(4); // 2 turns = 4 messages (2 visitor, 2 assistant)
  });
});
