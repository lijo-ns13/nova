import { z } from "zod";

export const FeatureCreateSchema = z.object({
  name: z.string().min(2, "Feature name is required"),
});

export const FeatureUpdateSchema = z.object({
  name: z.string().min(2, "Feature name is required"),
});

export type FeatureInput = z.infer<typeof FeatureCreateSchema>;
export type FeatureUpdateInput = z.infer<typeof FeatureUpdateSchema>;
