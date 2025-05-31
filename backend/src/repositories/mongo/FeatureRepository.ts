// src/repositories/feature.repository.ts
import { inject, injectable } from "inversify";

import { TYPES } from "../../di/types";
import { Model } from "mongoose";
import { IFeature } from "../../models/feature.modal";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class FeatureRepository extends BaseRepository<IFeature> {
  constructor(
    @inject(TYPES.featureModel)
    private _featureModel: Model<IFeature>
  ) {
    super(_featureModel);
  }

  async getByName(name: string): Promise<IFeature | null> {
    return await this.model.findOne({ name });
  }
}
