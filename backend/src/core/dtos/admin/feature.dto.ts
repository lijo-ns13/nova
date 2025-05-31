// src/core/dtos/admin/feature.dto.ts
import { z } from "zod";

export const FeatureCreateSchema = z.object({
  name: z.string().min(1),
});
export interface IFeatureCreateDto {
  name: string;
}

export interface IFeatureUpdateDto extends Partial<IFeatureCreateDto> {}
export const FeatureUpdateSchema = FeatureCreateSchema.partial();

export type FeatureInput = z.infer<typeof FeatureCreateSchema>;
export type FeatureUpdateInput = z.infer<typeof FeatureUpdateSchema>;
