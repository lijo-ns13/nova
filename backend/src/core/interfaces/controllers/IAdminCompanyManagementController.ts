// src/core/interfaces/controllers/IAdminCompanyManagementController.ts
import { RequestHandler, Request, Response } from "express";

export interface IAdminCompanyManagementController {
  getCompanyById: RequestHandler;
  verifyCompany: RequestHandler;
  getUnverifiedCompaniesHandler: RequestHandler;
  blockCompany: RequestHandler;
  unblockCompany: RequestHandler;
  getCompanies(req: Request, res: Response): Promise<void>;
}
