import { SubscriptionPlanResponse } from "../../core/dtos/admin/subscription.dto";
import { ISubscriptionPlan } from "../../models/subscription.modal";

export class SubscriptionPlanMapper {
  static toResponse(plan: ISubscriptionPlan): SubscriptionPlanResponse {
    return {
      id: plan._id.toString(),
      name: plan.name,
      price: plan.price,
      validityDays: plan.validityDays,
      isActive: plan.isActive,
    };
  }
}
