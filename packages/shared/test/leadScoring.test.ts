import { describe, it, expect } from "vitest";
import { calculateLeadPriority } from "../src/leadScoring";

describe("Pure Function Lead Scoring (TASK-022)", () => {
  it("scores Hot when phone is present, budget meets hot threshold, and timeline is within 3 months", () => {
    const priority = calculateLeadPriority({
      hasName: true,
      hasEmail: true,
      hasService: true,
      hasPhone: true,
      budgetMeetsHotThreshold: true,
      timelineWithin3Months: true
    });
    expect(priority).toBe("hot");
  });

  it("scores Warm when phone or hot budget is missing but name, email, and service are present", () => {
    const priority = calculateLeadPriority({
      hasName: true,
      hasEmail: true,
      hasService: true,
      hasPhone: false,
      budgetMeetsHotThreshold: false,
      timelineWithin3Months: false
    });
    expect(priority).toBe("warm");
  });

  it("scores Cold when essential contact information is missing", () => {
    const priority = calculateLeadPriority({
      hasName: true,
      hasEmail: false,
      hasService: true,
      hasPhone: false,
      budgetMeetsHotThreshold: false,
      timelineWithin3Months: false
    });
    expect(priority).toBe("cold");
  });
});
