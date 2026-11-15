import { describe, it, expect } from "vitest";
import { ModelGateway, AIResponseSchema } from "../src/services/modelGateway";

describe("Model Gateway & Fake Provider (TASK-014)", () => {
  it("generates deterministic schema-compliant answers with fake provider", async () => {
    const gateway = new ModelGateway({ useFake: true });
    const res = await gateway.generateResponse("Tell me about your AI services", [
      { chunkId: "chunk-1", title: "AI Services", body: "TriCore builds AI chatbots and automations." }
    ]);

    // Validate with Zod
    const parsed = AIResponseSchema.safeParse(res);
    expect(parsed.success).toBe(true);
    expect(res.answer).toContain("TriCore builds AI chatbots");
    expect(res.usedChunkIds).toContain("chunk-1");
  });

  it("handles pricing inquiries with standardized quote redirection", async () => {
    const gateway = new ModelGateway({ useFake: true });
    const res = await gateway.generateResponse("How much does a website cost?", []);

    expect(res.intent).toBe("pricing_inquiry");
    expect(res.answer).toContain("custom quotes");
  });

  it("handles ungrounded questions with polite fallback without guessing", async () => {
    const gateway = new ModelGateway({ useFake: true });
    const res = await gateway.generateResponse("Do you sell airplane parts?", []);

    expect(res.confidence).toBe("low");
    expect(res.answer).toContain("not completely certain");
  });
});
