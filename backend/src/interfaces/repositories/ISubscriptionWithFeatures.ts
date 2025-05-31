import { ISubscriptionPlan } from "../../models/subscription.modal";
import { IFeature } from "./IFeatureRepository";

export interface ISubscriptionWithFeatures {
  subscription: ISubscriptionPlan;
  features: string[]; // Array of feature names
}

export interface ISubscriptionWithFeaturesRepository {
  getActiveSubscriptionsWithFeatures(): Promise<ISubscriptionWithFeatures[]>;
}
