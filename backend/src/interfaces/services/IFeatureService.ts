import { FeatureSummaryDTO } from "../../dtos/response/admin/admin.feature.response.dto";
import {
  FeatureInput,
  FeatureUpdateInput,
} from "../../core/dtos/admin/feature.dto";

export interface IFeatureService {
  create(input: FeatureInput): Promise<FeatureSummaryDTO>;
  update(id: string, updates: FeatureUpdateInput): Promise<FeatureSummaryDTO>;
  delete(id: string): Promise<boolean>;
  getAll(): Promise<FeatureSummaryDTO[]>;
  getById(id: string): Promise<FeatureSummaryDTO>;
}
