// src/repositories/TransactionRepository.ts
import { injectable } from "inversify";
import { ITransactionRepository } from "../../interfaces/repositories/ITransactionRepository";
import tranasctionModal, { ITransaction } from "../../models/tranasction.modal";

@injectable()
export class TransactionRepository implements ITransactionRepository {
  async find(query: any): Promise<ITransaction[]> {
    return await tranasctionModal
      .find(query)
      .sort({ createdAt: -1 })
      .populate("userId", "name email");
  }

  async count(query: any = {}): Promise<number> {
    return await tranasctionModal.countDocuments(query);
  }

  async getTotalRevenue(query: any = {}): Promise<number> {
    const result = await tranasctionModal.aggregate([
      { $match: { ...query, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    return result.length > 0 ? result[0].total : 0;
  }
}
