import { uuidv7 } from "uuidv7";

export interface SampledChatReview {
  messageId: string;
  conversationId: string;
  sender: string;
  content: string;
}

export async function sampleWeeklyChats(
  db: D1Database,
  batchWeekStart: string,
  sampleSize = 20
): Promise<string> {
  const batchId = uuidv7();
  const now = Date.now();

  // Create review batch
  await db
    .prepare("INSERT INTO review_batch (id, week_start, created_at) VALUES (?, ?, ?)")
    .bind(batchId, batchWeekStart, now)
    .run();

  // Sample up to 20 assistant messages
  const messages = await db
    .prepare("SELECT id FROM message WHERE sender = 'assistant' ORDER BY RANDOM() LIMIT ?")
    .bind(sampleSize)
    .all<{ id: string }>();

  if (messages.results && messages.results.length > 0) {
    const stmts: D1PreparedStatement[] = [];
    for (const msg of messages.results) {
      const reviewId = uuidv7();
      stmts.push(
        db.prepare(
          "INSERT INTO review (id, batch_id, message_id, mark, reviewed_at) VALUES (?, ?, ?, 'pending', ?)"
        ).bind(reviewId, batchId, msg.id, now)
      );
    }
    await db.batch(stmts);
  }

  return batchId;
}

export async function submitChatReview(
  db: D1Database,
  reviewId: string,
  reviewerId: string,
  mark: "pass" | "fail" | "needs_fix",
  correctAnswer?: string
): Promise<void> {
  const now = Date.now();

  await db
    .prepare("UPDATE review SET reviewer_id = ?, mark = ?, reviewed_at = ? WHERE id = ?")
    .bind(reviewerId, mark, now, reviewId)
    .run();

  // If wrong or needs_fix, create tofix_item
  if (mark === "fail" || mark === "needs_fix") {
    const tofixId = uuidv7();
    await db
      .prepare(
        "INSERT INTO tofix_item (id, review_id, correct_answer, status, created_at) VALUES (?, ?, ?, 'open', ?)"
      )
      .bind(tofixId, reviewId, correctAnswer || null, now)
      .run();
  }
}
