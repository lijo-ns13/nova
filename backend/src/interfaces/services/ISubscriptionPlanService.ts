// src/interfaces/services/ISubscriptionPlanService.ts

import {
  TransactionFilterInput,
  TransactionResponseDTO,
} from "../../core/dtos/admin/admin.sub.dto";
import {
  SubscriptionPlanInput,
  SubscriptionPlanResponse,
  SubscriptionPlanUpdateInput,
} from "../../core/dtos/admin/subscription.dto";
import { TransactionListWithPagination } from "../../mapping/admin/admin.sub.mapper";

export interface ISubscriptionPlanService {
  getFilteredTransactions(
      filter: TransactionFilterInput
    ): Promise<TransactionListWithPagination>;
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
