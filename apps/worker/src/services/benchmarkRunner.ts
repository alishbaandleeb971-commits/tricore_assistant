import { uuidv7 } from "uuidv7";
import { ModelGateway } from "./modelGateway.js";

export interface BenchmarkQuestion {
  id: string;
  question: string;
  expectedKeywords: string[];
}

export interface BenchmarkResult {
  runId: string;
  totalQuestions: number;
  passed: number;
  score: number; // percentage
  status: "pass" | "fail";
}

export async function runBenchmarkEvaluation(
  db: D1Database,
  questions: BenchmarkQuestion[],
  gateway: ModelGateway
): Promise<BenchmarkResult> {
  const runId = uuidv7();
  const now = Date.now();
  let passedCount = 0;

  for (const q of questions) {
    const aiRes = await gateway.generateResponse(q.question, []);
    const lowerAnswer = aiRes.answer.toLowerCase();

    // Accuracy test: check if expected keywords or refusal occurred
    const passed = q.expectedKeywords.some((kw) => lowerAnswer.includes(kw.toLowerCase()));
    if (passed) passedCount++;

    const resultId = uuidv7();
    await db
      .prepare(
        `INSERT INTO test_result (id, run_id, question_id, assistant_answer, judgement)
         VALUES (?, ?, ?, ?, ?)`
      )
      .bind(resultId, runId, q.id, aiRes.answer, passed ? "pass" : "fail")
      .run()
      .catch(() => {});
  }

  const score = Math.round((passedCount / questions.length) * 100);
  const status = score >= 90 ? "pass" : "fail"; // 90% threshold (45/50)

  await db
    .prepare(
      `INSERT INTO test_run (id, status, score, passed, total_questions, started_at, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(runId, "completed", score, passedCount, questions.length, now, Date.now())
    .run();

  return {
    runId,
    totalQuestions: questions.length,
    passed: passedCount,
    score,
    status
  };
}
