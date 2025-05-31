// src/interfaces/services/IFeatureService.ts
import { IFeature } from "../repositories/IFeatureRepository";

export interface IFeatureService {
  create(feature: unknown): Promise<IFeature>;
  update(id: string, updates: unknown): Promise<IFeature | null>;
  delete(id: string): Promise<boolean>;
  getAll(): Promise<IFeature[]>;
  getById(id: string): Promise<IFeature | null>;
}
