import { handleApiError } from "../../../utils/apiError";
import apiAxios from "../../../utils/apiAxios";
const BASE_PATH = "/admin/analytics";

export interface UserGrowthDTO {
  count: string;
  date: string | number | Date;
  month: string;
  newUsers: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
}

const path = (endpoint: string) => `${BASE_PATH}${endpoint}`;
export interface RevenueStats {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export const getRevenueStats = async (
  range?: string
): Promise<RevenueStats> => {
  try {
    const res = await apiAxios.get<{ success: boolean; data: RevenueStats }>(
      path("/revenue-stats"),
      { params: { range } }
    );
    return res.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch revenue stats");
  }
};

export interface TopPlan {
  totalRevenue: string;
  count: string;
  planName: string;
  id: string;
  name: string;
  subscribers: number;
}

export const getTopPlans = async (range?: string): Promise<TopPlan[]> => {
  try {
    const res = await apiAxios.get<{ success: boolean; data: TopPlan[] }>(
      path("/top-plans"),
      { params: { range } }
    );
    return res.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch top plans");
  }
};

// DTOs
export interface UserGrowthDTO {
  month: string; // or day string depending on backend
  newUsers: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
}

// Get user growth (time series)
export const getUserGrowth = async (
  range?: string
): Promise<UserGrowthDTO[]> => {
  try {
    const res = await apiAxios.get<{ success: boolean; data: UserGrowthDTO[] }>(
      path("/user-growth"),
      { params: { range } }
    );
    return res.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch user growth data");
  }
};

// Get user stats summary
export const getUserStats = async (): Promise<UserStats> => {
  try {
    const res = await apiAxios.get<{ success: boolean; data: UserStats }>(
      path("/user-stats")
    );
    return res.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch user stats");
  }
};
// Transaction DTO
export interface Transaction {
  createdAt: string | number | Date;
  id: string;
  userId: {
    id: string;
    name: string;
  };
  planName: string;
  amount: number;
  date: string;
  currency: string;
  status: string;
  paymentMethod: string;
  stripeSessionId?: string;
}

// Full Report DTO
export interface FullReport {
  revenue: Record<string, number>;
  topPlans: { id: string; name: string; subscribers: number }[];
  userGrowth: { month: string; newUsers: number }[];
  userStats: { totalUsers: number; activeUsers: number };
  metadata: {
    generatedAt: string;
    timeRange: string;
    startDate?: string;
    endDate?: string;
  };
}

// Fetch transactions list
export const getTransactions = async (
  range?: string
): Promise<Transaction[]> => {
  try {
    const res = await apiAxios.get<{ success: boolean; data: Transaction[] }>(
      path("/transactions"),
      { params: { range } }
    );
    return res.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch transactions");
  }
};

// Download transaction CSV
export const downloadTransactionReport = async (range?: string) => {
  try {
    const res = await apiAxios.get(path("/download-report"), {
      params: { range },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `transaction_report_${range || "weekly"}_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    throw handleApiError(error, "Failed to download transaction report");
  }
};

// Fetch full report
export const getFullReport = async (range?: string): Promise<FullReport> => {
  try {
    const res = await apiAxios.get<{ success: boolean; data: FullReport }>(
      path("/full-report"),
      { params: { range } }
    );
    return res.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch full report");
  }
};
