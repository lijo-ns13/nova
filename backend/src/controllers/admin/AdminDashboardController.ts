import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { Request, Response } from "express";

import { handleControllerError } from "../../utils/errorHandler";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import {
  IAdminDashboardService,
  UserGrowthDTO,
} from "../../interfaces/services/IAdminDashboardService";
import { IAdminDashboardController } from "../../interfaces/controllers/IAdminDashboardController";
import {
  getFullReportSchema,
  getRevenueStatsSchema,
  getTopPlansSchema,
  getTransactionReportSchema,
  getTransactionsSchema,
  getUserGrowthSchema,
} from "../../dtos/request/admin/admin.dashbaord.dto";

@injectable()
export class AdminDashboardController implements IAdminDashboardController {
  constructor(
    @inject(TYPES.AdminDashboardService)
    private readonly _adminDashboardService: IAdminDashboardService
  ) {}

  async getRevenueStats(req: Request, res: Response): Promise<void> {
    try {
      const parsed = getRevenueStatsSchema.parse(req.query);
      console.log("parseddsfjkljlkd", parsed);
      const data = await this._adminDashboardService.getRevenueStats(parsed);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Revenue stats fetched successfully",
        data,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "AdminDashboardController.getRevenueStats"
      );
    }
  }
  async getTopPlans(req: Request, res: Response): Promise<void> {
    try {
      const input = getTopPlansSchema.parse(req.query);
      const data = await this._adminDashboardService.getTopPlans(input);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Top plans fetched successfully",
        data,
      });
    } catch (error) {
      handleControllerError(error, res, "AdminDashboardController.getTopPlans");
    }
  }
  async getUserGrowth(req: Request, res: Response): Promise<void> {
    try {
      const input = getUserGrowthSchema.parse(req.query);
      const data: UserGrowthDTO[] =
        await this._adminDashboardService.getUserGrowth(input);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "User growth data fetched successfully",
        data,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "AdminDashboardController.getUserGrowth"
      );
    }
  }
  async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const data = await this._adminDashboardService.getUserStats();
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "User stats fetched successfully",
        data,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "AdminDashboardController.getUserStats"
      );
    }
  }
  async downloadTransactionReport(req: Request, res: Response): Promise<void> {
    try {
      const parsed = getTransactionReportSchema.parse(req.query);
      const csv = await this._adminDashboardService.downloadTransactionReport(
        parsed
      );

      const range = parsed.range || "weekly";
      res.header("Content-Type", "text/csv");
      res.attachment(
        `transaction_report_${range}_${new Date()
          .toISOString()
          .slice(0, 10)}.csv`
      );
      res.send(csv);
    } catch (error) {
      handleControllerError(
        error,
        res,
        "AdminDashboardController.downloadTransactionReport"
      );
    }
  }
  async getFullReport(req: Request, res: Response): Promise<void> {
    try {
      const parsed = getFullReportSchema.parse(req.query);
      const report = await this._adminDashboardService.getFullReport(parsed);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Full report generated successfully",
        data: report,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "AdminDashboardController.getFullReport"
      );
    }
  }
  async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const parsed = getTransactionsSchema.parse(req.query);
      const transactions = await this._adminDashboardService.getTransactions(
        parsed
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Transactions fetched successfully",
        data: transactions,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "AdminDashboardController.getTransactions"
      );
    }
  }
}
