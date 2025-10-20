import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IFeatureService } from "../../interfaces/services/IFeatureService";
import { IFeatureRepository } from "../../interfaces/repositories/IFeatureRepository";
import { FeatureSummaryDTO } from "../../dtos/response/admin/admin.feature.response.dto";
import { FeatureInput } from "../../core/dtos/admin/feature.dto";
import { FeatureMapper } from "../../mapping/admin/admin.feature.mapper";
import logger from "../../utils/logger";
import { COMMON_MESSAGES } from "../../constants/message.constants";
@injectable()
export class FeatureService implements IFeatureService {
  private logger = logger.child({ context: "AdminFeatureService" });
  constructor(
    @inject(TYPES.FeatureRepository)
    private readonly _featureRepository: IFeatureRepository
  ) {}

  async create(input: FeatureInput): Promise<FeatureSummaryDTO> {
    const feature = await this._featureRepository.create(input);
    return FeatureMapper.toSummaryDTO(feature);
  }

  async update(id: string, updates: FeatureInput): Promise<FeatureSummaryDTO> {
    const feature = await this._featureRepository.update(id, updates);
    if (!feature) {
      this.logger.warn(COMMON_MESSAGES.FEATURE.NOT_UPDATED);
      throw new Error(COMMON_MESSAGES.FEATURE.NOT_UPDATED);
    }
    return FeatureMapper.toSummaryDTO(feature);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this._featureRepository.delete(id);
    if (!deleted) {
      this.logger.warn(COMMON_MESSAGES.FEATURE.NOT_DELETED);
      throw new Error(COMMON_MESSAGES.FEATURE.NOT_DELETED);
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
      this.logger.warn(COMMON_MESSAGES.FEATURE.NOT_FOUND);
      throw new Error(COMMON_MESSAGES.FEATURE.NOT_FOUND);
    }
    return FeatureMapper.toSummaryDTO(feature);
  }
}
