// src/interfaces/services/ISubscriptionPlanService.ts

import {
  SubscriptionPlanInput,
  SubscriptionPlanResponse,
  SubscriptionPlanUpdateInput,
} from "../../core/dtos/admin/subscription.dto";

export interface ISubscriptionPlanService {
  createPlan(input: SubscriptionPlanInput): Promise<SubscriptionPlanResponse>;
  updatePlan(
    id: string,
    updates: SubscriptionPlanUpdateInput
  ): Promise<SubscriptionPlanResponse>;
  deletePlan(id: string): Promise<void>;
  getAllPlans(): Promise<SubscriptionPlanResponse[]>;
  getPlanById(id: string): Promise<SubscriptionPlanResponse>;
  togglePlanStatus(
    id: string,
    isActive: boolean
  ): Promise<SubscriptionPlanResponse>;
}
