import { FeatureInput } from "../../core/dtos/admin/feature.dto";
import { FeatureSummaryDTO } from "../../dtos/response/admin/admin.feature.response.dto";
import {
  FeatureIdEntity,
  FeatureNameEntity,
  IFeature,
} from "../../repositories/entities/feature.entity";

export class FeatureMapper {
  static toSummaryDTO(feature: IFeature): FeatureSummaryDTO {
    return {
      id: feature._id.toString(),
      name: feature.name,
    };
  }
  static fromDTO(dto: FeatureInput): FeatureNameEntity {
    return {
      name: dto.name.trim(),
    };
  }
  static formIdDTO(dto: string): FeatureIdEntity {
    return {
      id: dto,
    };
  }
}
