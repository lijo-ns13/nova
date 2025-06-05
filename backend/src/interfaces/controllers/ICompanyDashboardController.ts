// src/interfaces/controllers/ICompanyDashboardController.ts
import { Request, Response } from "express";

export interface ICompanyDashboardController {
  getCompanyDashboardStats(req: Request, res: Response): Promise<void>;
}
