// src/services/subscriptionPlan.service.ts
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISubscriptionPlanService } from "../../interfaces/services/ISubscriptionPlanService";
import { ISubscriptionPlanRepository } from "../../interfaces/repositories/ISubscriptonPlanRepository";
import { ISubscriptionPlan } from "../../models/subscription.modal";

@injectable()
export class SubscriptionPlanService implements ISubscriptionPlanService {
  constructor(
    @inject(TYPES.SubscriptionPlanRepository)
    private _subscriptionPlanRepository: ISubscriptionPlanRepository
  ) {}

  async createPlan(
    plan: Partial<ISubscriptionPlan>
  ): Promise<ISubscriptionPlan> {
    return this._subscriptionPlanRepository.create(plan);
  }

  async updatePlan(
    id: string,
    updates: Partial<ISubscriptionPlan>
  ): Promise<ISubscriptionPlan | null> {
    // Prevent name change if needed
    if (updates.name) {
      delete updates.name;
    }
    return this._subscriptionPlanRepository.update(id, updates);
  }

  async deletePlan(id: string): Promise<boolean> {
    return this._subscriptionPlanRepository.delete(id);
  }

  async getAllPlans(): Promise<ISubscriptionPlan[]> {
    return this._subscriptionPlanRepository.getAll();
  }

  async getPlanById(id: string): Promise<ISubscriptionPlan | null> {
    return this._subscriptionPlanRepository.getById(id);
  }

  async togglePlanStatus(
    id: string,
    isActive: boolean
  ): Promise<ISubscriptionPlan | null> {
    return this._subscriptionPlanRepository.toggleStatus(id, isActive);
  }
}
