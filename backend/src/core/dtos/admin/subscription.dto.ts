// src/schemas/subscriptionPlan.schema.ts
import { z } from "zod";
import { ISubscriptionPlan } from "../../../models/subscription.modal";
import { Document } from "mongoose";

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
    .positive("Price must be positive"),
  validityDays: z
    .number({
      required_error: "Validity days is required",
      invalid_type_error: "Validity days must be a number",
    })
    .int("Validity days must be an integer")
    .positive("Validity days must be positive"),
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
export interface SubscriptionPlanResponse
  extends Omit<ISubscriptionPlan, keyof Document> {
  id: string;
}
