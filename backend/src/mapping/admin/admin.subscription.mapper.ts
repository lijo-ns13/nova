import { SubscriptionPlanResponse } from "../../core/dtos/admin/subscription.dto";
import { ISubscriptionPlan } from "../../repositories/entities/subscription.entity";

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
