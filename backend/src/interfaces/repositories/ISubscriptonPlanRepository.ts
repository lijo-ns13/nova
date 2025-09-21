import { ISubscriptionPlan } from "../../repositories/entities/subscription.entity";
import { IBaseRepository } from "./IBaseRepository";

export interface ISubscriptionPlanRepository
  extends IBaseRepository<ISubscriptionPlan> {
  findSubscriptionByName(name: string): Promise<ISubscriptionPlan | null>;
  create(plan: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan>;
  update(
    id: string,
    updates: Partial<ISubscriptionPlan>
  ): Promise<ISubscriptionPlan | null>;
  delete(id: string): Promise<boolean>;
  getAll(): Promise<ISubscriptionPlan[]>;
  getById(id: string): Promise<ISubscriptionPlan | null>;
  getByName(name: string): Promise<ISubscriptionPlan | null>;
  toggleStatus(
    id: string,
    isActive: boolean
  ): Promise<ISubscriptionPlan | null>;
  getAll(): Promise<ISubscriptionPlan[]>;
}
