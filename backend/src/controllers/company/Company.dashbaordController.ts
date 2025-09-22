import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ICompanyDashboardService } from "../../interfaces/services/ICompanyDashboardService";
import { ICompanyDashboardController } from "../../interfaces/controllers/ICompanyDashboardController";
import { TYPES } from "../../di/types";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";

@injectable()
export class CompanyDashboardController implements ICompanyDashboardController {
  constructor(
    @inject(TYPES.CompanyDashboardService)
    private readonly _dashboardService: ICompanyDashboardService
  ) {}

  async getCompanyDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.query.companyId as string;
      if (!companyId) {
        res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .json({ message: "Company ID missing" });
        return;
      }
      const result = await this._dashboardService.getCompanyDashboardStats(
        companyId
      );
      res.json(result);
    } catch (err) {
      console.error("Dashboard Controller Error", err);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: "Something went wrong" });
    }
  }
}
