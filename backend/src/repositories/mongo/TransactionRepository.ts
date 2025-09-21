import { inject, injectable } from "inversify";
import { ITransactionRepository } from "../../interfaces/repositories/ITransactionRepository";
import { TransactionFilterInput } from "../../core/dtos/admin/admin.sub.dto";
import { FilterQuery, Model, Types } from "mongoose";
import { TYPES } from "../../di/types";
import { BaseRepository } from "./BaseRepository";
import { ITransactionPopulated } from "../../mapping/admin/admin.sub.mapper";
import { eachDayOfInterval, format, isThisISOWeek } from "date-fns";
import {
  TopPlanDTO,
  UserGrowthDTO,
} from "../../interfaces/services/IAdminDashboardService";
import { TransactionDTO } from "../../dtos/request/admin/admin.dashbaord.dto";
import { ITransaction } from "../entities/transaction.entity";
import transactionModel from "../models/transaction.model";

@injectable()
export class TransactionRepository
  extends BaseRepository<ITransaction>
  implements ITransactionRepository
{
  constructor(
    @inject(TYPES.tranasctionModel) transactionModel: Model<ITransaction>
  ) {
    super(transactionModel);
  }
  async findTransactionBySession(
    sessionId: string
  ): Promise<ITransaction | null> {
    return transactionModel.findOne({ stripeSessionId: sessionId });
  }
  async findByStripeSessionId(sessionId: string): Promise<ITransaction | null> {
    return transactionModel.findOne({ stripeSessionId: sessionId });
  }

  async updateTransaction(
    transactionId: string,
    update: Partial<ITransaction>
  ): Promise<void> {
    await transactionModel.findByIdAndUpdate(transactionId, update);
  }
  async findLatestTransactionByUser(
    userId: string
  ): Promise<ITransaction | null> {
    return transactionModel
      .findOne({ userId, status: "completed" })
      .sort({ createdAt: -1 });
  }
  async createTransaction(data: Partial<ITransaction>): Promise<ITransaction> {
    return transactionModel.create(data);
  }
  async find(query: any): Promise<ITransaction[]> {
    return await this.model
      .find(query)
      .sort({ createdAt: -1 })
      .populate("userId", "name email");
  }

  async count(query: any = {}): Promise<number> {
    return await this.model.countDocuments(query);
  }

  async getTotalRevenue(query: any = {}): Promise<number> {
    const result = await this.model.aggregate([
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
    return await this.model.findByIdAndUpdate(
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
      this.model
        .find(query)
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec() as unknown as Promise<ITransactionPopulated[]>, // 👈 FIX
      this.model.countDocuments(query),
    ]);

    return { transactions, total };
  }
  // new
  async getRevenue(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.model.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    return result[0]?.totalRevenue || 0;
  }
  async getTopPlans(startDate: Date, endDate: Date): Promise<TopPlanDTO[]> {
    const result = await this.model.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$planName",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    return result.map((r) => ({
      planName: r._id,
      count: r.count,
      totalRevenue: r.totalRevenue,
    }));
  }
  async getUserGrowth(
    startDate: Date,
    endDate: Date
  ): Promise<UserGrowthDTO[]> {
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const result = await this.model.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing dates with 0
    return days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const found = result.find((item) => item._id === dateStr);
      return {
        date: dateStr,
        count: found ? found.count : 0,
      };
    });
  }
  async findTransactions(
    startDate: Date,
    endDate: Date
  ): Promise<ITransaction[]> {
    return this.model
      .find({
        status: "completed",
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .lean();
  }
  async getTransactions(
    startDate: Date,
    endDate: Date
  ): Promise<TransactionDTO[]> {
    const transactions = await this.model
      .find({
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate<{ userId: { _id: Types.ObjectId; name: string } }>(
        "userId",
        "name"
      )
      .lean();

    return transactions.map((tx) => ({
      id: tx._id.toHexString(),
      userId: {
        id: tx.userId._id.toHexString(),
        name: tx.userId.name,
      },
      amount: tx.amount,
      currency: tx.currency,
      status: tx.status,
      paymentMethod: tx.paymentMethod,
      stripeSessionId: tx.stripeSessionId,
      planName: tx.planName,
      createdAt: tx.createdAt!, // Assert it exists
    }));
  }
}
