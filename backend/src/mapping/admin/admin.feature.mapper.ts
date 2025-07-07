import { FeatureSummaryDTO } from "../../dtos/response/admin/admin.feature.response.dto";
import { IFeature } from "../../models/feature.modal";

export class FeatureMapper {
  static toSummaryDTO(feature: IFeature): FeatureSummaryDTO {
    return {
      id: feature._id.toString(),
      name: feature.name,
    };
  }
}
