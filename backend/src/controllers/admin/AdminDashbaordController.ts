// src/controllers/AdminDashboardController.ts
import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { IAdminDashboardController } from "../interfaces/controllers/IAdminDashboardController";
import { IAdminDashboardService } from "../interfaces/services/IAdminDashboardService";
import { HTTP_STATUS_CODES } from "../core/enums/httpStatusCode";
import {
  TimePeriod,
  SubscriptionPlanName,
  DownloadFormat,
} from "../types/dashboardTypes";

@injectable()
export class AdminDashboardController implements IAdminDashboardController {
  constructor(
    @inject(TYPES.AdminDashboardService)
    private dashboardService: IAdminDashboardService
  ) {}

  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.dashboardService.getDashboardStats();
      res.status(HTTP_STATUS_CODES.OK).json(stats);
    } catch (error) {
      this.handleError(res, error, "Error fetching dashboard stats");
    }
  }

  async getSubscriptionAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const period = this.validatePeriod(req.query.period as string);
      const analytics = await this.dashboardService.getSubscriptionAnalytics(
        period
      );
      res.status(HTTP_STATUS_CODES.OK).json(analytics);
    } catch (error) {
      this.handleError(res, error, "Error fetching subscription analytics");
    }
  }

  async getTransactionReports(req: Request, res: Response): Promise<void> {
    try {
      const period = this.validatePeriod(req.query.period as string);
      const planName = this.validatePlanName(req.query.planName as string);
      const reports = await this.dashboardService.getTransactionReports(
        period,
        planName
      );
      res.status(HTTP_STATUS_CODES.OK).json(reports);
    } catch (error) {
      this.handleError(res, error, "Error fetching transaction reports");
    }
  }

  async downloadTransactionReports(req: Request, res: Response): Promise<void> {
    try {
      const period = this.validatePeriod(req.query.period as string);
      const planName = this.validatePlanName(req.query.planName as string);
      const format = this.validateFormat(req.query.format as string);

      const result = await this.dashboardService.downloadTransactionReports(
        period,
        planName,
        format
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=transactions-${Date.now()}.${format}`
      );
      res.setHeader("Content-Type", result.contentType);
      res.send(result.data);
    } catch (error) {
      this.handleError(res, error, "Error downloading transaction reports");
    }
  }

  private validatePeriod(period: string): TimePeriod {
    const validPeriods: TimePeriod[] = ["daily", "weekly", "monthly", "yearly"];
    if (validPeriods.includes(period as TimePeriod)) {
      return period as TimePeriod;
    }
    throw new Error("Invalid period parameter");
  }

  private validatePlanName(
    planName: string | undefined
  ): SubscriptionPlanName | undefined {
    if (!planName) return undefined;
    const validPlans: SubscriptionPlanName[] = ["BASIC", "PRO", "PREMIUM"];
    if (validPlans.includes(planName as SubscriptionPlanName)) {
      return planName as SubscriptionPlanName;
    }
    throw new Error("Invalid planName parameter");
  }

  private validateFormat(format: string | undefined): DownloadFormat {
    const defaultFormat: DownloadFormat = "csv";
    if (!format) return defaultFormat;
    const validFormats: DownloadFormat[] = ["csv", "excel", "json"];
    if (validFormats.includes(format as DownloadFormat)) {
      return format as DownloadFormat;
    }
    throw new Error("Invalid format parameter");
  }

  private handleError(res: Response, error: unknown, context: string): void {
    console.error(`${context}:`, error);
    const status =
      error instanceof Error && error.message.includes("Invalid")
        ? HTTP_STATUS_CODES.BAD_REQUEST
        : HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    res.status(status).json({
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
}
