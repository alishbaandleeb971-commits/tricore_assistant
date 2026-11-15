import { describe, it, expect } from "vitest";
import { applyAnswerGuard } from "../src/services/answerGuard";

describe("Deterministic Answer Guard (TASK-016)", () => {
  it("strips invented dollar prices and replaces with fixed quote template", () => {
    const text = "A new website costs around $1,500 and takes two weeks.";
    const res = applyAnswerGuard(text, ["chunk-1"], ["chunk-1"]);

    expect(res.priceBlocked).toBe(true);
    expect(res.guardedAnswer).toContain("Every project at TriCore is custom-scoped");
    expect(res.guardedAnswer).not.toContain("$1,500");
  });

  it("filters out ungrounded chunk IDs not present in approved retrieved chunks", () => {
    const text = "We provide mobile app development using React Native.";
    const res = applyAnswerGuard(text, ["chunk-valid", "chunk-hallucinated"], ["chunk-valid"]);

    expect(res.ungroundedPassagesRemoved).toBe(true);
    expect(res.validChunkIds).toEqual(["chunk-valid"]);
  });
});
