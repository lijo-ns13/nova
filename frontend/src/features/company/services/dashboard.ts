import { APIResponse } from "../../../types/api";
import { handleApiError } from "../../../utils/apiError";
import apiAxios from "../../../utils/apiAxios";
import { ApplicationStatus } from "../../../constants/applicationStatus";

export interface CompanyDashboardStats {
  overview: {
    jobs: {
      total: number;
      open: number;
      closed: number;
    };
    applications: {
      total: number;
      recent: number;
      weeklyChange: number;
      monthlyChange: number;
    };
  };
  statusBreakdown: {
    status: ApplicationStatus;
    count: number;
    percentage: number;
  }[];
  trends: {
    daily: {
      date: string;
      total: number;
      statuses: Record<ApplicationStatus, number>;
    }[];
    weekly: {
      weekStart: string;
      total: number;
      statuses: Record<ApplicationStatus, number>;
    }[];
    monthly: {
      monthStart: string;
      total: number;
      statuses: Record<ApplicationStatus, number>;
    }[];
    jobStatus: {
      year: number;
      month: number;
      status: string;
      count: number;
    }[];
  };
}

// Fetch company dashboard stats
export const getCompanyDashboardStats = async (
  companyId: string
): Promise<CompanyDashboardStats> => {
  try {
    const result = await apiAxios.get<CompanyDashboardStats>(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/company/stats`,
      {
        params: { companyId },
        withCredentials: true,
      }
    );
    console.log("result", result);
    console.log("result.data", result.data);
    return result.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch company dashboard stats");
  }
};
