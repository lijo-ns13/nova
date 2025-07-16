import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISubscriptionPlanService } from "../../interfaces/services/ISubscriptionPlanService";
import { ISubscriptionPlanRepository } from "../../interfaces/repositories/ISubscriptonPlanRepository";
import {
  SubscriptionPlanInput,
  SubscriptionPlanResponse,
  SubscriptionPlanUpdateInput,
} from "../../core/dtos/admin/subscription.dto";

import logger from "../../utils/logger";
import { SubscriptionPlanMapper } from "../../mapping/admin/admin.subscription.mapper";
import {
  TransactionFilterInput,
  TransactionResponseDTO,
} from "../../core/dtos/admin/admin.sub.dto";
import { ITransactionRepository } from "../../interfaces/repositories/ITransactionRepository";
import { mapTransactionToDTO } from "../../mapping/admin/admin.sub.mapper";

@injectable()
export class SubscriptionPlanService implements ISubscriptionPlanService {
  private logger = logger.child({ context: "SubscriptionPlanService" });

  constructor(
    @inject(TYPES.SubscriptionPlanRepository)
    private _subscriptionPlanRepository: ISubscriptionPlanRepository,
    @inject(TYPES.TransactionRepository)
    private _transactionRepo: ITransactionRepository
  ) {}
  async getFilteredTransactions(
    filter: TransactionFilterInput
  ): Promise<TransactionResponseDTO[]> {
    const txns = await this._transactionRepo.findByFilter(filter);
    return txns.map(mapTransactionToDTO);
  }
  async createPlan(
    input: SubscriptionPlanInput
  ): Promise<SubscriptionPlanResponse> {
    const plan = await this._subscriptionPlanRepository.create(input);
    return SubscriptionPlanMapper.toResponse(plan);
  }

  async updatePlan(
    id: string,
    updates: SubscriptionPlanUpdateInput
  ): Promise<SubscriptionPlanResponse> {
    const updated = await this._subscriptionPlanRepository.update(id, updates);
    if (!updated) {
      this.logger.warn("Plan not found for update", { id });
      throw new Error("Subscription plan not found");
    }
    return SubscriptionPlanMapper.toResponse(updated);
  }

  async deletePlan(id: string): Promise<void> {
    const deleted = await this._subscriptionPlanRepository.delete(id);
    if (!deleted) {
      this.logger.warn("Plan not found for delete", { id });
      throw new Error("Subscription plan not found");
    }
  }

  async getAllPlans(): Promise<SubscriptionPlanResponse[]> {
    const plans = await this._subscriptionPlanRepository.getAll();
    return plans.map(SubscriptionPlanMapper.toResponse);
  }

  async getPlanById(id: string): Promise<SubscriptionPlanResponse> {
    const plan = await this._subscriptionPlanRepository.getById(id);
    if (!plan) {
      this.logger.warn("Plan not found by ID", { id });
      throw new Error("Subscription plan not found");
    }
    return SubscriptionPlanMapper.toResponse(plan);
  }

  async togglePlanStatus(
    id: string,
    isActive: boolean
  ): Promise<SubscriptionPlanResponse> {
    const updated = await this._subscriptionPlanRepository.toggleStatus(
      id,
      isActive
    );
    if (!updated) {
      this.logger.warn("Plan not found for toggle", { id });
      throw new Error("Subscription plan not found");
    }
    return SubscriptionPlanMapper.toResponse(updated);
  }
}
