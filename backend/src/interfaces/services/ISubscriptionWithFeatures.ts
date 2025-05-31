// src/interfaces/services/ISubscriptionWithFeaturesService.ts

import { ISubscriptionWithFeatures } from "../repositories/ISubscriptionWithFeatures";

export interface ISubscriptionWithFeaturesService {
  getActiveSubscriptionsWithFeatures(): Promise<ISubscriptionWithFeatures[]>;
}
