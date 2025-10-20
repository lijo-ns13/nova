import { z } from "zod";
import {
  TopPlanDTO,
  UserGrowthDTO,
  UserStatsDTO,
} from "../../../interfaces/services/IAdminDashboardService";

export const getRevenueStatsSchema = z.object({
  range: z.enum(["daily", "weekly", "monthly", "yearly", "custom"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type GetRevenueStatsInput = z.infer<typeof getRevenueStatsSchema>;
export const getTopPlansSchema = z.object({
  range: z.enum(["daily", "weekly", "monthly", "yearly", "custom"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type GetTopPlansInput = z.infer<typeof getTopPlansSchema>;
export const getUserGrowthSchema = z.object({
  range: z.enum(["daily", "weekly", "monthly", "yearly", "custom"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type GetUserGrowthInput = z.infer<typeof getUserGrowthSchema>;
export const getTransactionReportSchema = z.object({
  range: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type GetTransactionReportInput = z.infer<
  typeof getTransactionReportSchema
>;
export const getFullReportSchema = z.object({
  range: z.enum(["daily", "weekly", "monthly", "yearly", "custom"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type GetFullReportInput = z.infer<typeof getFullReportSchema>;
export const getTransactionsSchema = z.object({
  range: z.enum(["daily", "weekly", "monthly", "yearly", "custom"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type GetTransactionsInput = z.infer<typeof getTransactionsSchema>;
export interface TransactionDTO {
  id: string;
  userId: {
    id: string;
    name: string;
  };
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  stripeSessionId: string;
  planName: string;
  createdAt: Date;
}
export interface IFullReportDTO {
  metadata: {
    generatedAt: string; // ISO formatted
    timeRange: string;
    startDate?: string;
    endDate?: string;
  };
  revenue: Record<string, number>;
  topPlans: TopPlanDTO[];
  userGrowth: UserGrowthDTO[];
  userStats: UserStatsDTO;
}
