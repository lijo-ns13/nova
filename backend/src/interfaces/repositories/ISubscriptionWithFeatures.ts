import { ISubscriptionPlan } from "../../repositories/entities/subscription.entity";

export interface ISubscriptionWithFeatures {
  subscription: ISubscriptionPlan;
  features: string[];
}

export interface ISubscriptionWithFeaturesRepository {
  getActiveSubscriptionsWithFeatures(): Promise<ISubscriptionWithFeatures[]>;
}
