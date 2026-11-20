import { z } from "zod";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CLEAN_REGEX = /^[\d\s+()-]{7,20}$/;

export const LeadIntakeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().regex(EMAIL_REGEX, "Invalid email address"),
  serviceSlug: z.string().min(1, "Service selection is required"),
  phone: z.string().regex(PHONE_CLEAN_REGEX, "Invalid phone number").optional().nullable(),
  currency: z.enum(["USD", "PKR"]).default("USD"),
  budgetRangeId: z.string().optional().nullable(),
  timelineOptionId: z.string().optional().nullable(),
  description: z.string().max(1000).optional().nullable()
});

export type LeadIntakeData = z.infer<typeof LeadIntakeSchema>;

export interface ValidationResult {
  valid: boolean;
  errors?: Record<string, string>;
  data?: LeadIntakeData;
}

export function validateLeadIntake(input: unknown): ValidationResult {
  const result = LeadIntakeSchema.safeParse(input);
  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path.join(".");
      errors[field] = issue.message;
    }
    return { valid: false, errors };
  }
  return { valid: true, data: result.data };
}

export function formatLeadRecap(data: LeadIntakeData): string {
  const lines: string[] = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Service: ${data.serviceSlug}`,
    data.phone ? `Phone: ${data.phone}` : null,
    data.budgetRangeId ? `Budget: ${data.budgetRangeId} (${data.currency})` : null,
    data.timelineOptionId ? `Timeline: ${data.timelineOptionId}` : null,
    data.description ? `Project Notes: ${data.description}` : null
  ].filter((l): l is string => Boolean(l));

  return `Here is a summary of your inquiry:\n${lines.join("\n")}\n\nShall I submit this to our team?`;
}
