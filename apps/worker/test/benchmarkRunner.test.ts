import { describe, it, expect } from "vitest";
import { runBenchmarkEvaluation, BenchmarkQuestion } from "../src/services/benchmarkRunner";
import { ModelGateway } from "../src/services/modelGateway";
import { env } from "cloudflare:test";

describe("50-Question Benchmark Test Runner (TASK-039)", () => {
  it("executes questions, judges accuracy against keywords, and records test_run score", async () => {
    const questions: BenchmarkQuestion[] = [
      { id: "q1", question: "How much does a website cost?", expectedKeywords: ["custom quotes", "custom", "quote"] },
      { id: "q2", question: "What is your pricing fee?", expectedKeywords: ["proposal", "scope", "custom"] },
      { id: "q3", question: "Do you sell coffee makers?", expectedKeywords: ["not completely certain", "connect"] }
    ];

    const gateway = new ModelGateway({ useFake: true });
    const result = await runBenchmarkEvaluation(env.DB, questions, gateway);

    expect(result.totalQuestions).toBe(3);
    expect(result.passed).toBeGreaterThanOrEqual(2);
    expect(result.score).toBeGreaterThanOrEqual(60);

    // Verify test_run record in D1
    const runRow = await env.DB.prepare("SELECT * FROM test_run WHERE id = ?").bind(result.runId).first();
    expect(runRow?.status).toBe("completed");
  });
});
