import { ISubscriptionPlan } from "../../models/subscription.modal";

export interface ISubscriptionWithFeatures {
  subscription: ISubscriptionPlan;
  features: string[]; // Array of feature names
}

export interface ISubscriptionWithFeaturesRepository {
  getActiveSubscriptionsWithFeatures(): Promise<ISubscriptionWithFeatures[]>;
}
