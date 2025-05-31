// src/interfaces/repositories/IFeatureRepository.ts
import { Document } from "mongoose";
import { IBaseRepository } from "./IBaseRepository";

export interface IFeature extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFeatureRepository extends IBaseRepository<IFeature> {
  getByName(name: string): Promise<IFeature | null>;
}
