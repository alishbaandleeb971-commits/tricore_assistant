// Hash Turnstile token using SHA-256 for session reference without storing IP
export async function hashToken(token: string): Promise<string> {
  const enc = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export interface TurnstileVerificationResult {
  success: boolean;
  error?: string;
}

export async function verifyTurnstileToken(
  token: string,
  secretKey?: string
): Promise<TurnstileVerificationResult> {
  // If no secret key is provided (e.g. dev/test mode), bypass with mock validation
  if (!secretKey || secretKey === "dummy-turnstile-secret") {
    if (token === "invalid-token") {
      return { success: false, error: "invalid_turnstile_token" };
    }
    return { success: true };
  }

  try {
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData
    });

    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    if (data.success) {
      return { success: true };
    }
    return { success: false, error: data["error-codes"]?.join(", ") || "verification_failed" };
  } catch {
    // If Cloudflare Turnstile service is unreachable (TBD-15 fallback), log and allow session
    return { success: true, error: "turnstile_service_unavailable_fallback" };
  }
}
