// src/services/subscriptionWithFeatures.service.ts
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISubscriptionWithFeaturesRepository } from "../../interfaces/repositories/ISubscriptionWithFeatures";
import { ISubscriptionWithFeaturesService } from "../../interfaces/services/ISubscriptionWithFeatures";

@injectable()
export class SubscriptionWithFeaturesService
  implements ISubscriptionWithFeaturesService
{
  constructor(
    @inject(TYPES.SubscriptionWithFeaturesRepository)
    private repository: ISubscriptionWithFeaturesRepository
  ) {}

  async getActiveSubscriptionsWithFeatures() {
    return this.repository.getActiveSubscriptionsWithFeatures();
  }
}
