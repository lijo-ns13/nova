// src/core/interfaces/controllers/IAdminCompanyManagementController.ts
import { RequestHandler } from "express";

export interface IAdminCompanyManagementController {
  getCompanyById: RequestHandler;
  verifyCompany: RequestHandler;
  getUnverifiedCompaniesHandler: RequestHandler;
  blockCompany: RequestHandler;
  unblockCompany: RequestHandler;
  getCompanies: RequestHandler;
}
