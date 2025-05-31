// src/services/feature.service.ts
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";

import { ZodError } from "zod";
import {
  IFeature,
  IFeatureRepository,
} from "../../interfaces/repositories/IFeatureRepository";
import { IFeatureService } from "../../interfaces/services/IFeatureService";
import {
  FeatureCreateSchema,
  FeatureInput,
  FeatureUpdateInput,
  FeatureUpdateSchema,
} from "../../core/dtos/admin/feature.dto";

@injectable()
export class FeatureService implements IFeatureService {
  constructor(
    @inject(TYPES.FeatureRepository)
    private _featureRepository: IFeatureRepository
  ) {}

  private handleZodError(error: ZodError) {
    const errObj: Record<string, string> = {};
    error.errors.forEach((err) => {
      const path = err.path.join(".");
      errObj[path] = err.message;
    });
    return {
      statusCode: 400,
      errors: errObj,
      success: false,
    };
  }

  private validateCreateInput(input: unknown): FeatureInput {
    try {
      return FeatureCreateSchema.parse(input);
    } catch (error) {
      if (error instanceof ZodError) {
        throw this.handleZodError(error);
      }
      throw error;
    }
  }

  private validateUpdateInput(input: unknown): FeatureUpdateInput {
    try {
      return FeatureUpdateSchema.parse(input);
    } catch (error) {
      if (error instanceof ZodError) {
        throw this.handleZodError(error);
      }
      throw error;
    }
  }

  async create(feature: unknown): Promise<IFeature> {
    const validatedData = this.validateCreateInput(feature);
    return this._featureRepository.create(validatedData);
  }

  async update(id: string, updates: unknown): Promise<IFeature | null> {
    const validatedUpdates = this.validateUpdateInput(updates);
    return this._featureRepository.update(id, validatedUpdates);
  }

  async delete(id: string): Promise<boolean> {
    return this._featureRepository.delete(id);
  }

  async getAll(): Promise<IFeature[]> {
    return this._featureRepository.findAll();
  }

  async getById(id: string): Promise<IFeature | null> {
    return this._featureRepository.findById(id);
  }
}
