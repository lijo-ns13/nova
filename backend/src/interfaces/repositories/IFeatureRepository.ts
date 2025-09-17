import { IFeature } from "../../repositories/entities/feature.entity";
import { IBaseRepository } from "./IBaseRepository";

export interface IFeatureRepository extends IBaseRepository<IFeature> {
  getByName(name: string): Promise<IFeature | null>;
}
