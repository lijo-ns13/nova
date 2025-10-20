import { TransactionFilterInput } from "../../core/dtos/admin/admin.sub.dto";
import { TransactionDTO } from "../../dtos/request/admin/admin.dashbaord.dto";
import { ITransactionPopulated } from "../../mapping/admin/admin.sub.mapper";
import { ITransaction } from "../../repositories/entities/transaction.entity";
import {
  ITopPlanAggregation,
  IUserGrowthAggregation,
} from "../../repositories/mongo/TransactionRepository";

import { TransactionQueryParams } from "../../types/dashboardTypes";
import { TopPlanDTO, UserGrowthDTO } from "../services/IAdminDashboardService";

export interface ITransactionRepository {
  findTransactionBySession(sessionId: string): Promise<ITransaction | null>;
  createTransaction(data: Partial<ITransaction>): Promise<ITransaction>;
  findByStripeSessionId(sessionId: string): Promise<ITransaction | null>;
  findLatestTransactionByUser(userId: string): Promise<ITransaction | null>;
  updateTransaction(
    transactionId: string,
    update: Partial<ITransaction>
  ): Promise<void>;
  find(query: TransactionQueryParams): Promise<ITransaction[]>;
  count(query?: TransactionQueryParams): Promise<number>;
  getTotalRevenue(query?: TransactionQueryParams): Promise<number>;
  updateTransactionStatus(
    transactionId: string,
    status: string,
    refundData?: any
  ): Promise<ITransaction | null>;
  findByFilter(filter: TransactionFilterInput): Promise<{
    transactions: ITransactionPopulated[];
    total: number;
  }>;
  // new one
  getRevenue(startDate: Date, endDate: Date): Promise<number>;
  // getTopPlans(startDate: Date, endDate: Date): Promise<TopPlanDTO[]>;
  getTopPlans(startDate: Date, endDate: Date): Promise<ITopPlanAggregation[]>;
  // getUserGrowth(startDate: Date, endDate: Date): Promise<UserGrowthDTO[]>;
  getUserGrowth(
    startDate: Date,
    endDate: Date
  ): Promise<IUserGrowthAggregation[]>;
  findTransactions(startDate: Date, endDate: Date): Promise<ITransaction[]>;
  getTransactions(startDate: Date, endDate: Date): Promise<TransactionDTO[]>;
}
