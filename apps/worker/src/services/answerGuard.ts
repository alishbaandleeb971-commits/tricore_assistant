// Pricing patterns that are forbidden in assistant answers
const PRICE_PATTERNS = [
  /\$\s*\d+(?:,\d{3})*(?:\.\d{2})?/gi,
  /(?:rs\.?|pkr)\s*\d+(?:,\d{3})*/gi,
  /\b\d+\s*(?:dollars|usd|rupees)\b/gi,
  /\b(?:costs?|charges?|fees?)\s*(?:is|are|of)?\s*(?:around|about|approx)?\s*[\$£€\d]/gi
];

// Competitor names that should not be compared or mentioned negatively
const FORBIDDEN_COMPETITOR_PATTERNS = [
  /\b(?:competitor|rival)\b/gi
];

const FIXED_PRICE_REDIRECT =
  "Every project at TriCore is custom-scoped to match your specific goals. Would you like to share some project details so our team can prepare an accurate proposal?";

export interface GuardResult {
  guardedAnswer: string;
  priceBlocked: boolean;
  ungroundedPassagesRemoved: boolean;
  validChunkIds: string[];
}

export function applyAnswerGuard(
  answer: string,
  claimedChunkIds: string[],
  approvedChunkIds: string[]
): GuardResult {
  let guardedAnswer = answer;
  let priceBlocked = false;

  // 1. Detect and replace invented price quotes
  for (const pattern of PRICE_PATTERNS) {
    if (pattern.test(guardedAnswer)) {
      priceBlocked = true;
      guardedAnswer = FIXED_PRICE_REDIRECT;
      break;
    }
  }

  // 2. Validate grounding against approved chunk IDs
  const approvedSet = new Set(approvedChunkIds);
  const validChunkIds = claimedChunkIds.filter((id) => approvedSet.has(id));
  const ungroundedPassagesRemoved = validChunkIds.length < claimedChunkIds.length;

  return {
    guardedAnswer,
    priceBlocked,
    ungroundedPassagesRemoved,
    validChunkIds
  };
}
