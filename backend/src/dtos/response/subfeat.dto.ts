import { ISubscriptionPlan } from "../../repositories/entities/subscription.entity";

export interface UserCurrentSubscriptionDTO {
  subscription: ISubscriptionPlan;
  features: string[];
  subStartDate: Date;
  subEndDate: Date;
}
