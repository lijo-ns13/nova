import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IFeatureService } from "../../interfaces/services/IFeatureService";
import { IFeatureRepository } from "../../interfaces/repositories/IFeatureRepository";
import { FeatureSummaryDTO } from "../../dtos/response/admin/admin.feature.response.dto";
import {
  FeatureCreateSchema,
  FeatureInput,
  FeatureUpdateInput,
  FeatureUpdateSchema,
} from "../../core/dtos/admin/feature.dto";
import { FeatureMapper } from "../../mapping/admin/admin.feature.mapper";
import logger from "../../utils/logger";
@injectable()
export class FeatureService implements IFeatureService {
  private logger = logger.child({ context: "AdminFeatureService" });
  constructor(
    @inject(TYPES.FeatureRepository)
    private _featureRepository: IFeatureRepository
  ) {}

  async create(input: FeatureInput): Promise<FeatureSummaryDTO> {
    const feature = await this._featureRepository.create(input);
    return FeatureMapper.toSummaryDTO(feature);
  }

  async update(id: string, updates: FeatureInput): Promise<FeatureSummaryDTO> {
    const feature = await this._featureRepository.update(id, updates);
    if (!feature) {
      this.logger.warn("feature not updated");
      throw new Error("feature not updated");
    }
    return FeatureMapper.toSummaryDTO(feature);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this._featureRepository.delete(id);
    if (!deleted) {
      this.logger.warn("feature not deleted");
      throw new Error("feature not deleted");
    }
    return true;
  }

  async getAll(): Promise<FeatureSummaryDTO[]> {
    const features = await this._featureRepository.findAll();
    return features.map(FeatureMapper.toSummaryDTO);
  }

  async getById(id: string): Promise<FeatureSummaryDTO> {
    const feature = await this._featureRepository.findById(id);
    if (!feature) {
      this.logger.warn("feature not found");
      throw new Error("Feature not found");
    }
    return FeatureMapper.toSummaryDTO(feature);
  }
}
