import { injectable, inject } from "inversify";

import {
  subDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  parseISO,
} from "date-fns";
import { TYPES } from "../../di/types";
import {
  IAdminDashboardService,
  IFullReport,
  TopPlanDTO,
  UserGrowthDTO,
  UserStatsDTO,
} from "../../interfaces/services/IAdminDashboardService";
import { ITransactionRepository } from "../../interfaces/repositories/ITransactionRepository";
import {
  GetFullReportInput,
  GetRevenueStatsInput,
  GetTopPlansInput,
  GetTransactionReportInput,
  GetTransactionsInput,
  GetUserGrowthInput,
  TransactionDTO,
} from "../../dtos/request/admin/admin.dashbaord.dto";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { Parser } from "json2csv";

@injectable()
export class AdminDashboardService implements IAdminDashboardService {
  constructor(
    @inject(TYPES.TransactionRepository)
    private readonly _transactionRepository: ITransactionRepository,
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository
  ) {}

  async getRevenueStats(
    input: GetRevenueStatsInput
  ): Promise<Record<string, number>> {
    const now = new Date();

    let start: Date;
    let end: Date;
    const range = input.range || "weekly";

    if (range === "custom" && input.startDate && input.endDate) {
      start = parseISO(input.startDate);
      end = parseISO(input.endDate);
    } else {
      switch (range) {
        case "daily":
          start = startOfDay(now);
          end = endOfDay(now);
          break;
        case "weekly":
          start = startOfWeek(now);
          end = endOfWeek(now);
          break;
        case "monthly":
          start = startOfMonth(now);
          end = endOfMonth(now);
          break;
        case "yearly":
          start = startOfYear(now);
          end = endOfYear(now);
          break;
        default:
          start = startOfWeek(now);
          end = endOfWeek(now);
      }
    }

    const getRevenue = async (s: Date, e: Date) => {
      return this._transactionRepository.getRevenue(s, e);
    };

    const total = await getRevenue(start, end);

    return {
      [range]: total,
      daily:
        range === "daily"
          ? total
          : await getRevenue(startOfDay(now), endOfDay(now)),
      weekly:
        range === "weekly"
          ? total
          : await getRevenue(startOfWeek(now), endOfWeek(now)),
      monthly:
        range === "monthly"
          ? total
          : await getRevenue(startOfMonth(now), endOfMonth(now)),
      yearly:
        range === "yearly"
          ? total
          : await getRevenue(startOfYear(now), endOfYear(now)),
    };
  }
  async getTopPlans(input: GetTopPlansInput): Promise<TopPlanDTO[]> {
    const now = new Date();

    let start: Date;
    let end: Date;
    const range = input.range || "weekly";

    if (range === "custom" && input.startDate && input.endDate) {
      start = parseISO(input.startDate);
      end = parseISO(input.endDate);
    } else {
      switch (range) {
        case "daily":
          start = startOfDay(now);
          end = endOfDay(now);
          break;
        case "weekly":
          start = startOfWeek(now);
          end = endOfWeek(now);
          break;
        case "monthly":
          start = startOfMonth(now);
          end = endOfMonth(now);
          break;
        case "yearly":
          start = startOfYear(now);
          end = endOfYear(now);
          break;
        default:
          start = startOfWeek(now);
          end = endOfWeek(now);
      }
    }

    return this._transactionRepository.getTopPlans(start, end);
  }
  async getUserGrowth(input: GetUserGrowthInput): Promise<UserGrowthDTO[]> {
    const now = new Date();

    let start: Date;
    let end: Date;
    const range = input.range || "weekly";

    if (range === "custom" && input.startDate && input.endDate) {
      start = parseISO(input.startDate);
      end = parseISO(input.endDate);
    } else {
      switch (range) {
        case "daily":
          start = subDays(startOfDay(now), 7);
          end = endOfDay(now);
          break;
        case "weekly":
          start = subDays(startOfWeek(now), 30);
          end = endOfWeek(now);
          break;
        case "monthly":
          start = subDays(startOfMonth(now), 365);
          end = endOfMonth(now);
          break;
        case "yearly":
          start = subDays(startOfYear(now), 365 * 3);
          end = endOfYear(now);
          break;
        default:
          start = subDays(startOfWeek(now), 30);
          end = endOfWeek(now);
      }
    }

    return this._transactionRepository.getUserGrowth(start, end);
  }
  async getUserStats(): Promise<UserStatsDTO> {
    const [totalUsers, activeUsers] = await Promise.all([
      this._userRepository.countAllUsers(),
      this._userRepository.countActiveUsers(),
    ]);
    return { totalUsers, activeUsers };
  }
  async downloadTransactionReport(
    input: GetTransactionReportInput
  ): Promise<string> {
    const now = new Date();

    let start: Date;
    let end: Date;
    const range = input.range || "weekly";

    if (range === "custom" && input.startDate && input.endDate) {
      start = parseISO(input.startDate);
      end = parseISO(input.endDate);
    } else {
      switch (range) {
        case "daily":
          start = startOfDay(now);
          end = endOfDay(now);
          break;
        case "weekly":
          start = startOfWeek(now);
          end = endOfWeek(now);
          break;
        case "monthly":
          start = startOfMonth(now);
          end = endOfMonth(now);
          break;
        case "yearly":
          start = startOfYear(now);
          end = endOfYear(now);
          break;
        default:
          start = startOfWeek(now);
          end = endOfWeek(now);
      }
    }

    const transactions = await this._transactionRepository.findTransactions(
      start,
      end
    );

    const fields = [
      "_id",
      "userId",
      "amount",
      "currency",
      "status",
      "paymentMethod",
      "stripeSessionId",
      "planName",
      "createdAt",
    ];
    const parser = new Parser({ fields });
    return parser.parse(transactions);
  }
  async getFullReport(input: GetFullReportInput): Promise<IFullReport> {
    const now = new Date();
    const range = input.range || "weekly";

    const revenue = await this.getRevenueStats({
      range: input.range,
      startDate: input.startDate,
      endDate: input.endDate,
    });

    const topPlans = await this.getTopPlans({
      range: input.range,
      startDate: input.startDate,
      endDate: input.endDate,
    });

    const userGrowth = await this.getUserGrowth({
      range: input.range,
      startDate: input.startDate,
      endDate: input.endDate,
    });

    const userStats = await this.getUserStats();

    return {
      metadata: {
        generatedAt: now,
        timeRange: range,
        startDate: input.startDate,
        endDate: input.endDate,
      },
      revenue,
      topPlans,
      userGrowth,
      userStats,
    };
  }
  async getTransactions(
    input: GetTransactionsInput
  ): Promise<TransactionDTO[]> {
    const now = new Date();

    let start: Date;
    let end: Date;
    const range = input.range || "weekly";

    if (range === "custom" && input.startDate && input.endDate) {
      start = parseISO(input.startDate);
      end = parseISO(input.endDate);
    } else {
      switch (range) {
        case "daily":
          start = startOfDay(now);
          end = endOfDay(now);
          break;
        case "weekly":
          start = startOfWeek(now);
          end = endOfWeek(now);
          break;
        case "monthly":
          start = startOfMonth(now);
          end = endOfMonth(now);
          break;
        case "yearly":
          start = startOfYear(now);
          end = endOfYear(now);
          break;
        default:
          start = startOfWeek(now);
          end = endOfWeek(now);
      }
    }

    return this._transactionRepository.getTransactions(start, end);
  }
}
