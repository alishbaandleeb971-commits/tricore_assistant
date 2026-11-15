export type LeadPriority = "hot" | "warm" | "cold";

export interface LeadScoreInput {
  hasPhone: boolean;
  hasName: boolean;
  hasEmail: boolean;
  hasService: boolean;
  budgetMeetsHotThreshold: boolean;
  timelineWithin3Months: boolean;
}

/**
 * Pure function lead scoring implementation (BR-004 to BR-007):
 * - Hot: Phone provided + Budget >= threshold + Timeline <= 3 months
 * - Warm: Name + Email + Service provided (standard qualified lead)
 * - Cold: Partial details missing contact or service
 */
export function calculateLeadPriority(input: LeadScoreInput): LeadPriority {
  // Hot condition
  if (
    input.hasPhone &&
    input.budgetMeetsHotThreshold &&
    input.timelineWithin3Months &&
    input.hasName &&
    input.hasEmail &&
    input.hasService
  ) {
    return "hot";
  }

  // Warm condition
  if (input.hasName && input.hasEmail && input.hasService) {
    return "warm";
  }

  // Cold
  return "cold";
}
