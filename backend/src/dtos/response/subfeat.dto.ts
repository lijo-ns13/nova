import { ISubscriptionPlan } from "../../models/subscription.modal";

export interface UserCurrentSubscriptionDTO {
  subscription: ISubscriptionPlan;
  features: string[];
  subStartDate: Date;
  subEndDate: Date;
}
