import { z } from "zod";

// Base subscription plan schema
export const SubscriptionPlanCreateSchema = z.object({
  name: z.enum(["BASIC", "PRO", "PREMIUM"], {
    required_error: "Plan name is required",
    invalid_type_error: "Plan name must be BASIC, PRO, or PREMIUM",
  }),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be positive")
    .max(10000, "maximum is 10000"),
  validityDays: z
    .number({
      required_error: "Validity days is required",
      invalid_type_error: "Validity days must be a number",
    })
    .int("Validity days must be an integer")
    .positive("Validity days must be positive")
    .max(366, "Validity days cannot 366"),
  isActive: z.boolean().default(true).optional(),
});

// Update schema (name cannot be changed)
export const SubscriptionPlanUpdateSchema = SubscriptionPlanCreateSchema.omit({
  name: true,
}).partial();

export type SubscriptionPlanInput = z.infer<
  typeof SubscriptionPlanCreateSchema
>;
export type SubscriptionPlanUpdateInput = z.infer<
  typeof SubscriptionPlanUpdateSchema
>;

// Response DTO
export interface SubscriptionPlanResponse {
  id: string;
  name: "BASIC" | "PRO" | "PREMIUM";
  price: number;
  validityDays: number;
  isActive: boolean;
}
