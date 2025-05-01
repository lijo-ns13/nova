// src/core/interfaces/services/IAdminCompanyManagementService.ts

import { ICompany } from "../../../infrastructure/database/models/company.modal";

export interface IAdminCompanyManagementService {
  deleteCompany(companyId: string): Promise<any>;
  findCompanyById(companyId: string): Promise<any>;
  getCompanyById(companyId: string): Promise<any>;
  verifyCompany(
    companyId: string,
    status: "accepted" | "rejected"
  ): Promise<any>;
  blockCompany(companyId: string): Promise<any>;
  unblockCompany(companyId: string): Promise<any>;

  getCompanies(
    page?: number,
    limit?: number,
    searchQuery?: string
  ): Promise<{
    companies: ICompany[];
    pagination: {
      totalCompanies: number;
      totalPages: number;
      currentPage: number;
      companiesPerPage: number;
    };
  }>;
  getUnverifiedCompanies(
    page?: number,
    limit?: number
  ): Promise<{
    companies: any[];
    pagination: {
      totalCompanies: number;
      totalPages: number;
      currentPage: number;
      companiesPerPage: number;
    };
  }>;
}
