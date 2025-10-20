import { eachDayOfInterval, format } from "date-fns";
import {
  IFullReport,
  TopPlanDTO,
  UserGrowthDTO,
} from "../../interfaces/services/IAdminDashboardService";
import {
  ITopPlanAggregation,
  IUserGrowthAggregation,
} from "../../repositories/mongo/TransactionRepository";
import { IFullReportDTO } from "../../dtos/request/admin/admin.dashbaord.dto";

export class TransactionMapper {
  static toTopPlanDTO(raw: ITopPlanAggregation): TopPlanDTO {
    return {
      planName: raw._id,
      count: raw.count,
      totalRevenue: raw.totalRevenue,
    };
  }

  static toTopPlanDTOList(rawList: ITopPlanAggregation[]): TopPlanDTO[] {
    return rawList.map((item) => TransactionMapper.toTopPlanDTO(item));
  }
  // --- User Growth ---
  static toUserGrowthDTOList(
    rawList: IUserGrowthAggregation[],
    startDate: Date,
    endDate: Date
  ): UserGrowthDTO[] {
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const found = rawList.find((item) => item._id === dateStr);
      return {
        date: dateStr,
        count: found ? found.count : 0,
      };
    });
  }
  static toFullReportDTO(domain: IFullReport): IFullReportDTO {
    return {
      metadata: {
        generatedAt: domain.metadata.generatedAt.toISOString(),
        timeRange: domain.metadata.timeRange,
        startDate: domain.metadata.startDate,
        endDate: domain.metadata.endDate,
      },
      revenue: domain.revenue,
      topPlans: domain.topPlans.map((plan) => ({
        planName: plan.planName,
        count: plan.count,
        totalRevenue: plan.totalRevenue,
      })),
      userGrowth: domain.userGrowth.map((growth) => ({
        date: growth.date,
        count: growth.count,
      })),
      userStats: {
        totalUsers: domain.userStats.totalUsers,
        activeUsers: domain.userStats.activeUsers,
      },
    };
  }
}
