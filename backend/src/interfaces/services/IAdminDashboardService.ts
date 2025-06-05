// src/interfaces/services/IAdminDashboardService.ts

import { ITransaction } from "../../models/tranasction.modal";
import { SubscriptionPlanName, TimePeriod } from "../../types/dashboardTypes";

export interface SubscriptionAnalytics {
  total: number;
  data: {
    date: string;
    BASIC: number;
    PRO: number;
    PREMIUM: number;
    total: number;
  }[];
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
}

export interface TransactionReport {
  total: number;
  totalAmount: number;
  data: ITransaction[];
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
}

export interface DownloadResult {
  data: Buffer | string;
  contentType: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalCompanies: number;
  verifiedCompanies: number;
  pendingCompanies: number;
  totalTransactions: number;
  transactionRevenue: number;
  subscriptionDistribution: {
    BASIC: number;
    PRO: number;
    PREMIUM: number;
  };
}

export interface IAdminDashboardService {
  getSubscriptionAnalytics(period: TimePeriod): Promise<SubscriptionAnalytics>;
  getDashboardStats(): Promise<DashboardStats>;
  //   getSubscriptionAnalytics(period: string): Promise<SubscriptionAnalytics>;
  getTransactionReports(
    period: TimePeriod,
    planName?: SubscriptionPlanName
  ): Promise<TransactionReport>;
  //   getTransactionReports(
  //     period: string,
  //     planName?: string
  //   ): Promise<TransactionReport>;
  downloadTransactionReports(
    period: string,
    planName?: string,
    format?: string
  ): Promise<DownloadResult>;
}
