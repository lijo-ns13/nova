import { UserCurrentSubscriptionDTO } from "../../dtos/response/subfeat.dto";
import { ISubscriptionWithFeatures } from "../repositories/ISubscriptionWithFeatures";

export interface ISubscriptionWithFeaturesService {
  getUserCurrentSubscription(
    userId: string
  ): Promise<UserCurrentSubscriptionDTO>;
  getActiveSubscriptionsWithFeatures(): Promise<ISubscriptionWithFeatures[]>;
}
