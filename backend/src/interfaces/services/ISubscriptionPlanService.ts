// src/interfaces/services/ISubscriptionPlanService.ts

import { ISubscriptionPlan } from "../../models/subscription.modal";

export interface ISubscriptionPlanService {
  createPlan(plan: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan>;
  updatePlan(
    id: string,
    updates: Partial<ISubscriptionPlan>
  ): Promise<ISubscriptionPlan | null>;
  deletePlan(id: string): Promise<boolean>;
  getAllPlans(): Promise<ISubscriptionPlan[]>;
  getPlanById(id: string): Promise<ISubscriptionPlan | null>;
  togglePlanStatus(
    id: string,
    isActive: boolean
  ): Promise<ISubscriptionPlan | null>;
}
