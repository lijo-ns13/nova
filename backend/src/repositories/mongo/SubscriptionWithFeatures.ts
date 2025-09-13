import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import {
  ISubscriptionWithFeatures,
  ISubscriptionWithFeaturesRepository,
} from "../../interfaces/repositories/ISubscriptionWithFeatures";
import { ISubscriptionPlanRepository } from "../../interfaces/repositories/ISubscriptonPlanRepository";
import { IFeatureRepository } from "../../interfaces/repositories/IFeatureRepository";

@injectable()
export class SubscriptionWithFeaturesRepository
  implements ISubscriptionWithFeaturesRepository
{
  constructor(
    @inject(TYPES.SubscriptionPlanRepository)
    private subscriptionPlanRepository: ISubscriptionPlanRepository,
    @inject(TYPES.FeatureRepository)
    private featureRepository: IFeatureRepository
  ) {}

  async getActiveSubscriptionsWithFeatures(): Promise<
    ISubscriptionWithFeatures[]
  > {
    const [activeSubscriptions, allFeatures] = await Promise.all([
      this.subscriptionPlanRepository.findAll({ isActive: true }),
      this.featureRepository.findAll(),
    ]);

    const featureNames = allFeatures.map((feature) => feature.name);

    return activeSubscriptions.map((subscription) => ({
      subscription,
      features: featureNames,
    }));
  }
}
