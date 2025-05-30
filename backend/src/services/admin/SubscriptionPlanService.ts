// src/services/subscriptionPlan.service.ts
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISubscriptionPlanService } from "../../interfaces/services/ISubscriptionPlanService";
import { ISubscriptionPlanRepository } from "../../interfaces/repositories/ISubscriptonPlanRepository";
import { ISubscriptionPlan } from "../../models/subscription.modal";
import { ZodError } from "zod";
import {
  SubscriptionPlanCreateSchema,
  SubscriptionPlanInput,
  SubscriptionPlanUpdateInput,
  SubscriptionPlanUpdateSchema,
} from "../../core/dtos/admin/subscription.dto";

@injectable()
export class SubscriptionPlanService implements ISubscriptionPlanService {
  constructor(
    @inject(TYPES.SubscriptionPlanRepository)
    private _subscriptionPlanRepository: ISubscriptionPlanRepository
  ) {}

  private handleZodError(error: ZodError) {
    const errObj: Record<string, string> = {};
    error.errors.forEach((err) => {
      const path = err.path.join(".");
      errObj[path] = err.message;
    });
    return {
      statusCode: 400,
      errors: errObj,
      success: false,
    };
  }

  private validateCreateInput(input: unknown): SubscriptionPlanInput {
    try {
      return SubscriptionPlanCreateSchema.parse(input);
    } catch (error) {
      if (error instanceof ZodError) {
        throw this.handleZodError(error);
      }
      throw error;
    }
  }

  private validateUpdateInput(input: unknown): SubscriptionPlanUpdateInput {
    try {
      return SubscriptionPlanUpdateSchema.parse(input);
    } catch (error) {
      if (error instanceof ZodError) {
        throw this.handleZodError(error);
      }
      throw error;
    }
  }

  async createPlan(plan: unknown): Promise<ISubscriptionPlan> {
    const validatedData = this.validateCreateInput(plan);
    return this._subscriptionPlanRepository.create(validatedData);
  }

  async updatePlan(
    id: string,
    updates: unknown
  ): Promise<ISubscriptionPlan | null> {
    const validatedUpdates = this.validateUpdateInput(updates);
    return this._subscriptionPlanRepository.update(id, validatedUpdates);
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
