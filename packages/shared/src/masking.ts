// Credit card Luhn algorithm check
function isValidLuhn(digits: string): boolean {
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits.charAt(i), 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n = (n % 10) + 1;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

// Regex to capture card candidates: 13 to 19 digits, optionally separated by spaces or dashes
const CARD_REGEX = /\b(?:\d[ -]*?){13,19}\b/g;

// Password / secret keywords pattern
const PASSWORD_REGEX = /(?:password|passwd|pwd|secret|api[_-]?key|token)\s*[:=]\s*([^\s,;]+)/gi;

export function maskPII(input: string): string {
  if (!input) return "";

  // 1. Mask credit cards that pass Luhn check
  let masked = input.replace(CARD_REGEX, (match) => {
    const rawDigits = match.replace(/[\s-]/g, "");
    if (rawDigits.length >= 13 && rawDigits.length <= 19 && isValidLuhn(rawDigits)) {
      return "[hidden]";
    }
    return match;
  });

  // 2. Mask password-like phrases
  masked = masked.replace(PASSWORD_REGEX, (match, secretVal) => {
    return match.replace(secretVal, "[hidden]");
  });

  return masked;
}
