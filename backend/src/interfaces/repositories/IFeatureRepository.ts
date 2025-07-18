import { IFeature } from "../../models/feature.modal";
import { IBaseRepository } from "./IBaseRepository";

export interface IFeatureRepository extends IBaseRepository<IFeature> {
  getByName(name: string): Promise<IFeature | null>;
}
