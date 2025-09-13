import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { Model } from "mongoose";
import { BaseRepository } from "./BaseRepository";
import { IFeature } from "../entities/feature.entity";

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
