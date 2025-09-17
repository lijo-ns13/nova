import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ICompanyDashboardService } from "../../interfaces/services/ICompanyDashboardService";
import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import { IJobRepository } from "../../interfaces/repositories/IJobRepository";
import {
  DailyTrend,
  DashboardSummary,
  MonthlyTrend,
  StatusDistribution,
  Trends,
  WeeklyTrend,
} from "../../core/entities/dashbaord.interface";
import { ApplicationStatus } from "../../core/enums/applicationStatus";

@injectable()
export class CompanyDashboardService implements ICompanyDashboardService {
  constructor(
    @inject(TYPES.JobRepository) private jobRepository: IJobRepository,
    @inject(TYPES.ApplicationRepository)
    private applicationRepository: IApplicationRepository
  ) {}

  async getCompanyDashboardStats(companyId: string): Promise<{
    summary: DashboardSummary;
    statusDistribution: StatusDistribution[];
    trends: Trends;
  }> {
    const jobIds = await this.jobRepository.findJobIdsByCompany(companyId);

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const threeMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 3,
      now.getDate()
    );
    const oneYearAgo = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate()
    );
    const [
      totalJobs,
      openJobs,
      closedJobs,
      totalApplications,
      recentApplications,
      statusCounts,
      dailyTrend,
      weeklyTrend,
      monthlyTrend,
      jobStatusTrend,
    ] = await Promise.all([
      this.jobRepository.countJobsByCompany(companyId),
      this.jobRepository.countJobsByCompanyAndStatus(companyId, "open"),
      this.jobRepository.countJobsByCompanyAndStatus(companyId, "closed"),
      this.applicationRepository.countApplications(jobIds),
      this.applicationRepository.countApplicationsSince(jobIds, oneWeekAgo),
      this.applicationRepository.aggregateStatusCounts(jobIds),
      this.applicationRepository.aggregateDailyTrend(jobIds, oneWeekAgo),
      this.applicationRepository.aggregateWeeklyTrend(jobIds, threeMonthsAgo),
      this.applicationRepository.aggregateMonthlyTrend(jobIds, oneYearAgo),
      this.jobRepository.aggregateJobStatusTrend(companyId),
    ]);

    const formattedStatusCounts: StatusDistribution[] = Object.values(
      ApplicationStatus
    ).map((status) => {
      const found = statusCounts.find((s) => s._id === status);
      return {
        status,
        count: found ? found.count : 0,
        percentage:
          totalApplications > 0
            ? Math.round(((found ? found.count : 0) / totalApplications) * 100)
            : 0,
      };
    });

    const weeklyPercentageChange = this.calculatePercentageChange(weeklyTrend);
    const monthlyPercentageChange =
      this.calculatePercentageChange(monthlyTrend);

    return {
      summary: {
        totalJobs,
        openJobs,
        closedJobs,
        totalApplications,
        recentApplications,
        applicationChange: {
          weekly: weeklyPercentageChange,
          monthly: monthlyPercentageChange,
        },
      },
      statusDistribution: formattedStatusCounts,
      trends: {
        daily: this.formatDailyTrend(dailyTrend),
        weekly: this.formatWeeklyTrend(weeklyTrend),
        monthly: this.formatMonthlyTrend(monthlyTrend),
        jobStatus: jobStatusTrend.map((trend) => ({
          year: trend.year,
          month: trend.month,
          status: trend.status,
          count: trend.count,
        })),
      },
    };
  }
  private calculatePercentageChange(data: any[]): number {
    if (data.length < 2) return 0;
    const recent = data[data.length - 1].count;
    const previous = data[data.length - 2].count;
    return previous > 0
      ? Math.round(((recent - previous) / previous) * 100)
      : 0;
  }

  private formatDailyTrend(data: any[]): DailyTrend[] {
    return data.map((day) => ({
      date: day.date,
      total: day.count,
      statuses: this.countStatuses(day.statuses),
    }));
  }

  private formatWeeklyTrend(data: any[]): WeeklyTrend[] {
    return data.map((week) => ({
      weekStart: week.weekStart,
      total: week.count,
      statuses: this.countStatuses(week.statuses),
    }));
  }

  private formatMonthlyTrend(data: any[]): MonthlyTrend[] {
    return data.map((month) => ({
      monthStart: month.monthStart,
      total: month.count,
      statuses: this.countStatuses(month.statuses),
    }));
  }

  private countStatuses(
    statuses: ApplicationStatus[]
  ): Record<ApplicationStatus, number> {
    const counts: Record<ApplicationStatus, number> = Object.values(
      ApplicationStatus
    ).reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {} as Record<ApplicationStatus, number>);
    statuses.forEach((status) => {
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }
}
