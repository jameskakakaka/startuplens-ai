
import { z } from "zod";

export const StartupInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Startup name is required.")
    .max(100, "Startup name is too long."),

  industry: z
    .string()
    .trim()
    .min(1, "Industry is required.")
    .max(100, "Industry is too long."),

  description: z
    .string()
    .trim()
    .min(30, "Description must contain at least 30 characters.")
    .max(3000, "Description must not exceed 3000 characters."),  

  targetCustomer: z
    .string()
    .trim()
    .min(1, "Target customer is required.")
    .max(500, "Target customer is too long."),

  businessModel: z
    .string()
    .trim()
    .min(1, "Business model is required.")
    .max(500, "Business model is too long."),
});

export type StartupInput = z.infer<
  typeof StartupInputSchema
>;


