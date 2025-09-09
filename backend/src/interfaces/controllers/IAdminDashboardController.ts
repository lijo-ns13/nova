import { Request, Response } from "express";

export interface IAdminDashboardController {
  getRevenueStats(req: Request, res: Response): Promise<void>;
  getTopPlans(req: Request, res: Response): Promise<void>;
  getUserGrowth(req: Request, res: Response): Promise<void>;
  getUserStats(req: Request, res: Response): Promise<void>;
  downloadTransactionReport(req: Request, res: Response): Promise<void>;
  getFullReport(req: Request, res: Response): Promise<void>;
  getTransactions(req: Request, res: Response): Promise<void>;
}
