import {
  DashboardSummary,
  StatusDistribution,
  Trends,
} from "../../core/entities/dashbaord.interface";
import { ApplicationStatus } from "../../core/enums/applicationStatus";

export interface CompanyDashboardDTO {
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

export class CompanyDashboardMapper {
  static toDTO(data: {
    summary: DashboardSummary;
    statusDistribution: StatusDistribution[];
    trends: Trends;
  }): CompanyDashboardDTO {
    return {
      overview: {
        jobs: {
          total: data.summary.totalJobs,
          open: data.summary.openJobs,
          closed: data.summary.closedJobs,
        },
        applications: {
          total: data.summary.totalApplications,
          recent: data.summary.recentApplications,
          weeklyChange: data.summary.applicationChange.weekly,
          monthlyChange: data.summary.applicationChange.monthly,
        },
      },
      statusBreakdown: data.statusDistribution.map((item) => ({
        status: item.status,
        count: item.count,
        percentage: item.percentage,
      })),
      trends: {
        daily: data.trends.daily.map((item) => ({
          date: item.date.toISOString(),
          total: item.total,
          statuses: item.statuses,
        })),
        weekly: data.trends.weekly.map((item) => ({
          weekStart: item.weekStart.toISOString(),
          total: item.total,
          statuses: item.statuses,
        })),
        monthly: data.trends.monthly.map((item) => ({
          monthStart: item.monthStart.toISOString(),
          total: item.total,
          statuses: item.statuses,
        })),
        jobStatus: data.trends.jobStatus.map((item) => ({
          year: item.year,
          month: item.month,
          status: item.status,
          count: item.count,
        })),
      },
    };
  }
}
