// src/interfaces/repositories/IFeatureRepository.ts
import { Document } from "mongoose";
import { IBaseRepository } from "./IBaseRepository";
import { IFeature } from "../../models/feature.modal";

export interface IFeatureRepository extends IBaseRepository<IFeature> {
  getByName(name: string): Promise<IFeature | null>;
}
