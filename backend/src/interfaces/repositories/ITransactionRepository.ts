// src/interfaces/repositories/ITransactionRepository.ts
import { TransactionFilterInput } from "../../core/dtos/admin/admin.sub.dto";
import { ITransactionPopulated } from "../../mapping/admin/admin.sub.mapper";
import { ITransaction } from "../../models/tranasction.modal";
import { TransactionQueryParams } from "../../types/dashboardTypes";

export interface ITransactionRepository {
  find(query: TransactionQueryParams): Promise<ITransaction[]>;
  count(query?: TransactionQueryParams): Promise<number>;
  getTotalRevenue(query?: TransactionQueryParams): Promise<number>;
  updateTransactionStatus(
    transactionId: string,
    status: string,
    refundData?: any
  ): Promise<ITransaction | null>;
  findByFilter(
    filter: TransactionFilterInput
  ): Promise<ITransactionPopulated[]>;
}
