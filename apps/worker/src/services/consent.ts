import { uuidv7 } from "uuidv7";

export interface RecordConsentParams {
  conversationId: string;
  wordingVersion: number;
  purpose: "lead_contact" | "analytics";
  decision: boolean; // true = consented, false = declined
}

export interface ConsentResult {
  consentId: string;
  allowedToIntake: boolean;
  message: string;
}

export async function recordVisitorConsent(
  db: D1Database,
  params: RecordConsentParams
): Promise<ConsentResult> {
  const consentId = uuidv7();
  const decisionInt = params.decision ? 1 : 0;
  const now = Date.now();

  await db
    .prepare(
      `INSERT INTO consent_record (id, conversation_id, wording_version, purpose, decision, recorded_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(consentId, params.conversationId, params.wordingVersion, params.purpose, decisionInt, now)
    .run();

  if (!params.decision) {
    return {
      consentId,
      allowedToIntake: false,
      message: "No problem at all! You can continue chatting or asking questions about our services."
    };
  }

  return {
    consentId,
    allowedToIntake: true,
    message: "Thank you! What is your name and the best email address to reach you?"
  };
}
