import { inject, injectable } from "inversify";
import { BaseRepository } from "./BaseRepository";

import { ISubscriptionPlanRepository } from "../../interfaces/repositories/ISubscriptonPlanRepository";
import { TYPES } from "../../di/types";
import { Model } from "mongoose";
import { ISubscriptionPlan } from "../entities/subscription.entity";

@injectable()
export class SubscriptionPlanRepository
  extends BaseRepository<ISubscriptionPlan>
  implements ISubscriptionPlanRepository
{
  constructor(
    @inject(TYPES.subscriptionModel)
    private subscriptionModel: Model<ISubscriptionPlan>
  ) {
    super(subscriptionModel);
  }

  async getByName(name: string): Promise<ISubscriptionPlan | null> {
    return await this.model.findOne({ name });
  }

  async toggleStatus(
    id: string,
    isActive: boolean
  ): Promise<ISubscriptionPlan | null> {
    return await this.model.findByIdAndUpdate(id, { isActive }, { new: true });
  }

  async create(plan: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan> {
    const existingPlan = await this.getByName(plan.name!);
    if (existingPlan) {
      throw new Error(
        `Subscription plan with name ${plan.name} already exists`
      );
    }
    return super.create(plan);
  }

  async getAll(): Promise<ISubscriptionPlan[]> {
    return await this.model.find().sort({ createdAt: -1 });
  }

  async getById(id: string): Promise<ISubscriptionPlan | null> {
    return super.findById(id);
  }
}
