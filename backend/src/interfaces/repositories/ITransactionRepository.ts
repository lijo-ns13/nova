// src/interfaces/repositories/ITransactionRepository.ts
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
}
