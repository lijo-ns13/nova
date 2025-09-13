import { z } from "zod";

// Strict validation
export const FeatureCreateSchema = z.object({
  name: z.string().trim().min(1, "Feature name is required"),
});

export const FeatureUpdateSchema = FeatureCreateSchema;

export type FeatureInput = z.infer<typeof FeatureCreateSchema>;
export type FeatureUpdateInput = z.infer<typeof FeatureUpdateSchema>;
