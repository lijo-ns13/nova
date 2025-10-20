import {
  MonthlyTrend,
  StatusDistribution,
  WeeklyTrend,
  JobStatusTrend,
  ApplicationStatusCount,
} from "../../core/entities/dashbaord.interface";
import { inject, injectable } from "inversify";
import { ApplicationStatus } from "../../core/enums/applicationStatus";
import { IJobRepository } from "../../interfaces/repositories/IJobRepository";
import { IApplicationRepository } from "../../interfaces/repositories/IUserApplicationRepository";
import { ICompanyDashboardService } from "../../interfaces/services/ICompanyDashboardService";
import {
  CompanyDashboardDTO,
  CompanyDashboardMapper,
} from "../../mapping/company/company.dash.mapper";
import { TYPES } from "../../di/types";

injectable();
export class CompanyDashboardService implements ICompanyDashboardService {
  constructor(
    @inject(TYPES.JobRepository) private readonly _JobRepo: IJobRepository,
    @inject(TYPES.ApplicationRepository)
    private readonly _applicationRepo: IApplicationRepository
  ) {}
  async getCompanyDashboardStats(
    companyId: string
  ): Promise<CompanyDashboardDTO> {
    const jobIds = await this._JobRepo.findJobIdsByCompany(companyId);

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
      this._JobRepo.countJobsByCompany(companyId),
      this._JobRepo.countJobsByCompanyAndStatus(companyId, "open"),
      this._JobRepo.countJobsByCompanyAndStatus(companyId, "closed"),
      this._applicationRepo.countApplications(jobIds),
      this._applicationRepo.countApplicationsSince(jobIds, oneWeekAgo),
      this._applicationRepo.aggregateStatusCounts(jobIds),
      this._applicationRepo.aggregateDailyTrend(jobIds, oneWeekAgo),
      this._applicationRepo.aggregateWeeklyTrend(jobIds, threeMonthsAgo),
      this._applicationRepo.aggregateMonthlyTrend(jobIds, oneYearAgo),
      this._JobRepo.aggregateJobStatusTrend(companyId),
    ]);

    const formattedStatusCounts: StatusDistribution[] = Object.values(
      ApplicationStatus
    ).map((status) => {
      const found = statusCounts.find(
        (s: ApplicationStatusCount) => s._id === status
      );
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

    const rawData = {
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
        daily: dailyTrend,
        weekly: weeklyTrend,
        monthly: monthlyTrend,
        jobStatus: jobStatusTrend.map((trend: JobStatusTrend) => ({
          year: trend.year,
          month: trend.month,
          status: trend.status,
          count: trend.count,
        })),
      },
    };
    ////*
    return CompanyDashboardMapper.toDTO(rawData);
  }

  private calculatePercentageChange(
    data: WeeklyTrend[] | MonthlyTrend[]
  ): number {
    if (data.length < 2) return 0;
    const recent = data[data.length - 1].total;
    const previous = data[data.length - 2].total;
    return previous > 0
      ? Math.round(((recent - previous) / previous) * 100)
      : 0;
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
