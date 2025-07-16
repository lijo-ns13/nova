// src/repositories/TransactionRepository.ts
import { inject, injectable } from "inversify";
import { ITransactionRepository } from "../../interfaces/repositories/ITransactionRepository";
import tranasctionModal, { ITransaction } from "../../models/tranasction.modal";
import { TransactionFilterInput } from "../../core/dtos/admin/admin.sub.dto";
import { FilterQuery, Model } from "mongoose";
import { TYPES } from "../../di/types";
import { BaseRepository } from "./BaseRepository";
import { ITransactionPopulated } from "../../mapping/admin/admin.sub.mapper";

@injectable()
export class TransactionRepository
  extends BaseRepository<ITransaction>
  implements ITransactionRepository
{
  constructor(
    @inject(TYPES.tranasctionModal) tranasctionModal: Model<ITransaction>
  ) {
    super(tranasctionModal);
  }
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
  async updateTransactionStatus(
    transactionId: string,
    status: string,
    refundData?: any
  ): Promise<ITransaction | null> {
    return await tranasctionModal.findByIdAndUpdate(
      transactionId,
      { status, ...refundData },
      { new: true }
    );
  }
  async findByFilter(filter: TransactionFilterInput): Promise<{
    transactions: ITransactionPopulated[];
    total: number;
  }> {
    const query: FilterQuery<ITransaction> = {};

    if (filter.status) query.status = filter.status;
    if (filter.planName) query.planName = filter.planName;
    if (filter.userId) query.userId = filter.userId;

    if (filter.from || filter.to) {
      query.createdAt = {};
      if (filter.from) query.createdAt.$gte = new Date(filter.from);
      if (filter.to) query.createdAt.$lte = new Date(filter.to);
    }

    if (filter.isActiveOnly === "true") {
      query.status = "completed";
      query.refundDate = null;
    }

    const page = parseInt(filter.page ?? "1", 10);
    const limit = parseInt(filter.limit ?? "10", 10);
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      tranasctionModal
        .find(query)
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      tranasctionModal.countDocuments(query),
    ]);

    return { transactions, total };
  }
}
