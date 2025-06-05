// src/interfaces/services/ICompanyDashboardService.ts
import { ApplicationStatus } from "../../models/application.modal";

export interface ICompanyDashboardService {
  getCompanyDashboardStats(companyId: string): Promise<{
    summary: {
      totalJobs: number;
      openJobs: number;
      closedJobs: number;
      totalApplications: number;
      recentApplications: number;
      applicationChange: {
        weekly: number;
        monthly: number;
      };
    };
    statusDistribution: {
      status: ApplicationStatus;
      count: number;
      percentage: number;
    }[];
    trends: {
      daily: any[];
      weekly: any[];
      monthly: any[];
      jobStatus: any[];
    };
  }>;
}
