import { describe, it, expect } from "vitest";
import { validateLeadIntake, formatLeadRecap } from "../src/leadIntake";

describe("Conversational Lead Intake & Validation (TASK-021)", () => {
  it("validates valid lead intake and formats recap summary", () => {
    const raw = {
      name: "Ahmed Ali",
      email: "ahmed@example.com",
      serviceSlug: "ai-services",
      phone: "+92 300 1234567",
      currency: "USD",
      budgetRangeId: "usd-2",
      timelineOptionId: "1m",
      description: "Need an AI chatbot for customer service"
    };

    const res = validateLeadIntake(raw);
    expect(res.valid).toBe(true);
    expect(res.data?.name).toBe("Ahmed Ali");

    const recap = formatLeadRecap(res.data!);
    expect(recap).toContain("Ahmed Ali");
    expect(recap).toContain("ahmed@example.com");
    expect(recap).toContain("Shall I submit this to our team?");
  });

  it("fails validation when required fields (name, email, service) are missing or invalid", () => {
    const invalid = {
      name: "A",
      email: "not-an-email",
      serviceSlug: ""
    };

    const res = validateLeadIntake(invalid);
    expect(res.valid).toBe(false);
    expect(res.errors?.name).toBeDefined();
    expect(res.errors?.email).toBeDefined();
    expect(res.errors?.serviceSlug).toBeDefined();
  });
});
