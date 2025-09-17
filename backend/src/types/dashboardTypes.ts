import { ITransaction } from "../repositories/entities/transaction.entity";

export type TimePeriod = "daily" | "weekly" | "monthly" | "yearly";
export type SubscriptionPlanName = "BASIC" | "PRO" | "PREMIUM";
export type DownloadFormat = "csv" | "excel" | "json";

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalCompanies: number;
  verifiedCompanies: number;
  pendingCompanies: number;
  totalTransactions: number;
  transactionRevenue: number;
  subscriptionDistribution: Record<SubscriptionPlanName, number>;
}

export interface SubscriptionAnalytics {
  total: number;
  data: {
    date: string;
    BASIC: number;
    PRO: number;
    PREMIUM: number;
    total: number;
  }[];
  chartData: ChartData;
}

export interface TransactionReport {
  total: number;
  totalAmount: number;
  data: ITransaction[];
  chartData: ChartData;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor?: string;
  }[];
}

export interface DownloadResult {
  data: Buffer | string;
  contentType: string;
}

export interface TransactionQueryParams {
  createdAt?: {
    $gte: Date;
    $lte: Date;
  };
  status?: "pending" | "completed" | "failed";
  planName?: SubscriptionPlanName;
}
