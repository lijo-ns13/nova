import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISubscriptionWithFeaturesRepository } from "../../interfaces/repositories/ISubscriptionWithFeatures";
import { ISubscriptionWithFeaturesService } from "../../interfaces/services/ISubscriptionWithFeatures";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { ISubscriptionPlanRepository } from "../../interfaces/repositories/ISubscriptonPlanRepository";
import { IFeatureRepository } from "../../interfaces/repositories/IFeatureRepository";
import { UserCurrentSubscriptionDTO } from "../../dtos/response/subfeat.dto";
import {
  COMMON_MESSAGES,
  USER_MESSAGES,
} from "../../constants/message.constants";

@injectable()
export class SubscriptionWithFeaturesService
  implements ISubscriptionWithFeaturesService
{
  constructor(
    @inject(TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(TYPES.FeatureRepository)
    private readonly _featRepo: IFeatureRepository,
    @inject(TYPES.SubscriptionPlanRepository)
    private readonly _subRepo: ISubscriptionPlanRepository,
    @inject(TYPES.SubscriptionWithFeaturesRepository)
    private readonly _subWithFeatRepo: ISubscriptionWithFeaturesRepository
  ) {}
  async getUserCurrentSubscription(
    userId: string
  ): Promise<UserCurrentSubscriptionDTO> {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new Error(COMMON_MESSAGES.USER_NOT_FOUND);

    if (!user.subscription) throw new Error(COMMON_MESSAGES.USER_NOP_SUB);

    if (!user.subscriptionStartDate || !user.subscriptionEndDate)
      throw new Error(USER_MESSAGES.SUB.DATES_NOT_FOUND);

    const subData = await this._subRepo.findById(user.subscription.toString());
    if (!subData) throw new Error(USER_MESSAGES.SUB.DATA_NOT_FOUND);

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
