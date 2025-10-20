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
import { TransactionFilterInput } from "../../core/dtos/admin/admin.sub.dto";
import { ITransactionRepository } from "../../interfaces/repositories/ITransactionRepository";
import {
  mapTransactionToDTO,
  TransactionListWithPagination,
} from "../../mapping/admin/admin.sub.mapper";
import { COMMON_MESSAGES } from "../../constants/message.constants";

@injectable()
export class SubscriptionPlanService implements ISubscriptionPlanService {
  private logger = logger.child({ context: "SubscriptionPlanService" });

  constructor(
    @inject(TYPES.SubscriptionPlanRepository)
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    @inject(TYPES.TransactionRepository)
    private readonly _transactionRepo: ITransactionRepository
  ) {}
  async getFilteredTransactions(
    filter: TransactionFilterInput
  ): Promise<TransactionListWithPagination> {
    const { transactions, total } = await this._transactionRepo.findByFilter(
      filter
    );

    return {
      transactions: transactions.map(mapTransactionToDTO),
      total,
      page: parseInt(filter.page ?? "1", 10),
      limit: parseInt(filter.limit ?? "10", 10),
    };
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
      this.logger.warn(COMMON_MESSAGES.SUB.NOT_FOUND);
      throw new Error(COMMON_MESSAGES.SUB.NOT_FOUND);
    }
    return SubscriptionPlanMapper.toResponse(updated);
  }

  async deletePlan(id: string): Promise<void> {
    const deleted = await this._subscriptionPlanRepository.delete(id);
    if (!deleted) {
      this.logger.warn(COMMON_MESSAGES.SUB.NOT_FOUND);
      throw new Error(COMMON_MESSAGES.SUB.NOT_FOUND);
    }
  }

  async getAllPlans(): Promise<SubscriptionPlanResponse[]> {
    const plans = await this._subscriptionPlanRepository.getAll();
    return plans.map(SubscriptionPlanMapper.toResponse);
  }

  async getPlanById(id: string): Promise<SubscriptionPlanResponse> {
    const plan = await this._subscriptionPlanRepository.getById(id);
    if (!plan) {
      this.logger.warn(COMMON_MESSAGES.SUB.NOT_FOUND);
      throw new Error(COMMON_MESSAGES.SUB.NOT_FOUND);
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
      this.logger.warn(COMMON_MESSAGES.SUB.NOT_FOUND);
      throw new Error(COMMON_MESSAGES.SUB.NOT_FOUND);
    }
    return SubscriptionPlanMapper.toResponse(updated);
  }
}
