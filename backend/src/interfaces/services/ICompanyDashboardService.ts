import {
  DashboardSummary,
  StatusDistribution,
  Trends,
} from "../../core/entities/dashbaord.interface";

export interface ICompanyDashboardService {
  getCompanyDashboardStats(companyId: string): Promise<{
    summary: DashboardSummary;
    statusDistribution: StatusDistribution[];
    trends: Trends;
  }>;
}
