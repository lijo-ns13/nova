// src/services/subscriptionWithFeatures.service.ts
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISubscriptionWithFeaturesRepository } from "../../interfaces/repositories/ISubscriptionWithFeatures";
import { ISubscriptionWithFeaturesService } from "../../interfaces/services/ISubscriptionWithFeatures";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { ISubscriptionPlanRepository } from "../../interfaces/repositories/ISubscriptonPlanRepository";
import { IFeatureRepository } from "../../interfaces/repositories/IFeatureRepository";
import { UserCurrentSubscriptionDTO } from "../../dtos/response/subfeat.dto";

@injectable()
export class SubscriptionWithFeaturesService
  implements ISubscriptionWithFeaturesService
{
  constructor(
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.FeatureRepository) private _featRepo: IFeatureRepository,
    @inject(TYPES.SubscriptionPlanRepository)
    private _subRepo: ISubscriptionPlanRepository,
    @inject(TYPES.SubscriptionWithFeaturesRepository)
    private _subWithFeatRepo: ISubscriptionWithFeaturesRepository
  ) {}
  async getUserCurrentSubscription(
    userId: string
  ): Promise<UserCurrentSubscriptionDTO> {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    if (!user.subscription) throw new Error("User has no subscription");

    if (!user.subscriptionStartDate || !user.subscriptionEndDate)
      throw new Error("Subscription dates not found");

    const subData = await this._subRepo.findById(user.subscription.toString());
    if (!subData) throw new Error("Subscription data not found");

    const features = await this._featRepo.findAll();
    const featName = features.map((feat) => feat.name);

    return {
      subscription: subData,
      features: featName,
      subStartDate: user.subscriptionStartDate,
      subEndDate: user.subscriptionEndDate,
    };
  }
  async getActiveSubscriptionsWithFeatures() {
    return this._subWithFeatRepo.getActiveSubscriptionsWithFeatures();
  }
}
