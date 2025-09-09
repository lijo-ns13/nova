// src/interfaces/repositories/ITransactionRepository.ts
import { TransactionFilterInput } from "../../core/dtos/admin/admin.sub.dto";
import { TransactionDTO } from "../../dtos/request/admin/admin.dashbaord.dto";
import { ITransactionPopulated } from "../../mapping/admin/admin.sub.mapper";
import { ITransaction } from "../../models/tranasction.modal";
import { TransactionQueryParams } from "../../types/dashboardTypes";
import { TopPlanDTO, UserGrowthDTO } from "../services/IAdminDashboardService";

export interface ITransactionRepository {
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
  getTopPlans(startDate: Date, endDate: Date): Promise<TopPlanDTO[]>;
  getUserGrowth(startDate: Date, endDate: Date): Promise<UserGrowthDTO[]>;

  findTransactions(startDate: Date, endDate: Date): Promise<ITransaction[]>;
  getTransactions(startDate: Date, endDate: Date): Promise<TransactionDTO[]>;
}
