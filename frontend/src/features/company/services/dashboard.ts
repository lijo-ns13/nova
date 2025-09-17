import { APIResponse } from "../../../types/api";
import { handleApiError } from "../../../utils/apiError";
import apiAxios from "../../../utils/apiAxios";

export interface DashboardSummary {
  totalJobs: number;
  openJobs: number;
  closedJobs: number;
  totalApplications: number;
  recentApplications: number;
  applicationChange: {
    weekly: number;
    monthly: number;
  };
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface TrendItem {
  date?: string;
  weekStart?: string;
  monthStart?: string;
  total: number;
  statuses: Record<string, number>;
}

export interface DashboardStats {
  summary: DashboardSummary;
  statusDistribution: StatusDistribution[];
  trends: {
    daily: TrendItem[];
    weekly: TrendItem[];
    monthly: TrendItem[];
    jobStatus?: any;
  };
}

// Fetch company dashboard stats
export const getCompanyDashboardStats = async (
  companyId: string
): Promise<DashboardStats> => {
  try {
    const result = await apiAxios.get<DashboardStats>(
      `${import.meta.env.VITE_API_BASE_URL}/stats`,
      {
        params: { companyId },
        withCredentials: true,
      }
    );
    console.log("reuslt", result);
    console.log("rsultdata", result.data);
    return result.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch company dashboard stats");
  }
};
