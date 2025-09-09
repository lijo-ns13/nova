// // src/interfaces/services/IAdminDashboardService.ts

import {
  GetFullReportInput,
  GetRevenueStatsInput,
  GetTopPlansInput,
  GetTransactionReportInput,
  GetTransactionsInput,
  GetUserGrowthInput,
  TransactionDTO,
} from "../../dtos/request/admin/admin.dashbaord.dto";

// import { ITransaction } from "../../models/tranasction.modal";
// import { SubscriptionPlanName, TimePeriod } from "../../types/dashboardTypes";

// export interface SubscriptionAnalytics {
//   total: number;
//   data: {
//     date: string;
//     BASIC: number;
//     PRO: number;
//     PREMIUM: number;
//     total: number;
//   }[];
//   chartData: {
//     labels: string[];
//     datasets: {
//       label: string;
//       data: number[];
//       backgroundColor: string[];
//     }[];
//   };
// }

// export interface TransactionReport {
//   total: number;
//   totalAmount: number;
//   data: ITransaction[];
//   chartData: {
//     labels: string[];
//     datasets: {
//       label: string;
//       data: number[];
//       backgroundColor: string;
//     }[];
//   };
// }

// export interface DownloadResult {
//   data: Buffer | string;
//   contentType: string;
// }

// export interface DashboardStats {
//   totalUsers: number;
//   activeUsers: number;
//   blockedUsers: number;
//   totalCompanies: number;
//   verifiedCompanies: number;
//   pendingCompanies: number;
//   totalTransactions: number;
//   transactionRevenue: number;
//   subscriptionDistribution: {
//     BASIC: number;
//     PRO: number;
//     PREMIUM: number;
//   };
// }

// export interface IAdminDashboardService {
//   getSubscriptionAnalytics(period: TimePeriod): Promise<SubscriptionAnalytics>;
//   getDashboardStats(): Promise<DashboardStats>;
//   //   getSubscriptionAnalytics(period: string): Promise<SubscriptionAnalytics>;
//   getTransactionReports(
//     period: TimePeriod,
//     planName?: SubscriptionPlanName
//   ): Promise<TransactionReport>;
//   //   getTransactionReports(
//   //     period: string,
//   //     planName?: string
//   //   ): Promise<TransactionReport>;
//   downloadTransactionReports(
//     period: string,
//     planName?: string,
//     format?: string
//   ): Promise<DownloadResult>;
// }

export interface IAdminDashboardService {
  getRevenueStats(input: GetRevenueStatsInput): Promise<Record<string, number>>;
  getTopPlans(input: GetTopPlansInput): Promise<TopPlanDTO[]>;
  getUserGrowth(input: GetUserGrowthInput): Promise<UserGrowthDTO[]>;
  getUserStats(): Promise<UserStatsDTO>;
  downloadTransactionReport(input: GetTransactionReportInput): Promise<string>;
  getFullReport(input: GetFullReportInput): Promise<IFullReport>;
  getTransactions(input: GetTransactionsInput): Promise<TransactionDTO[]>;
}
export interface TopPlanDTO {
  planName: string;
  count: number;
  totalRevenue: number;
}
export interface UserGrowthDTO {
  date: string;
  count: number;
}
export interface UserStatsDTO {
  totalUsers: number;
  activeUsers: number;
}
export interface IFullReport {
  metadata: {
    generatedAt: Date;
    timeRange: string;
    startDate?: string;
    endDate?: string;
  };
  revenue: Record<string, number>;
  topPlans: TopPlanDTO[];
  userGrowth: UserGrowthDTO[];
  userStats: UserStatsDTO;
}
