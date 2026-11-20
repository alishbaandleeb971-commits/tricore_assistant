export * from "./masking.js";
import { z } from "zod";

export const ServiceNameSchema = z.enum([
  "AI Services",
  "Digital Marketing",
  "Web Development",
  "Graphic Designing",
  "SEO",
  "Video Editing",
  "Mobile App Development",
  "WordPress Development"
]);

export type ServiceName = z.infer<typeof ServiceNameSchema>;

export const HealthStatusSchema = z.object({
  status: z.literal("ok"),
  timestamp: z.string(),
  version: z.string()
});

export type HealthStatus = z.infer<typeof HealthStatusSchema>;
