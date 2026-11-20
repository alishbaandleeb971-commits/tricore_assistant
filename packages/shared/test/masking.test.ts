import { describe, it, expect } from "vitest";
import { maskPII } from "../src/masking";

describe("PII Masking Engine (TASK-010)", () => {
  it("masks valid credit cards with Luhn check", () => {
    // Valid Visa test card
    const card = "4111 1111 1111 1111";
    const text = `My card is ${card} please charge it`;
    expect(maskPII(text)).toBe("My card is [hidden] please charge it");

    // Dashed card
    const dashed = "4111-1111-1111-1111";
    expect(maskPII(`Paying with ${dashed}`)).toBe("Paying with [hidden]");
  });

  it("does not mask innocent numbers or phone numbers that fail Luhn check", () => {
    const phone = "+92 300 1234567";
    expect(maskPII(phone)).toBe(phone);

    const invoice = "Order #123456789012345";
    // If not a valid Luhn, remains untouched
    expect(maskPII(invoice)).toBe(invoice);
  });

  it("masks passwords and secrets in key-value text", () => {
    expect(maskPII("My password: mySecretPassword123!")).toBe("My password: [hidden]");
    expect(maskPII("api_key = abc123xyz789")).toBe("api_key = [hidden]");
    expect(maskPII("token: secret_bearer_token")).toBe("token: [hidden]");
  });
});
