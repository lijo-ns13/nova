import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ICompanyDashboardService } from "../../interfaces/services/ICompanyDashboardService";
import { ICompanyDashboardController } from "../../interfaces/controllers/ICompanyDashboardController";
import { TYPES } from "../../di/types";

@injectable()
export class CompanyDashboardController implements ICompanyDashboardController {
  constructor(
    @inject(TYPES.CompanyDashboardService)
    private dashboardService: ICompanyDashboardService
  ) {}

  async getCompanyDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.query.companyId as string;
      if (!companyId) {
        res.status(400).json({ message: "Company ID missing" });
        return;
      }
      const result = await this.dashboardService.getCompanyDashboardStats(
        companyId
      );
      res.json(result);
    } catch (err) {
      console.error("Dashboard Controller Error", err);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}
