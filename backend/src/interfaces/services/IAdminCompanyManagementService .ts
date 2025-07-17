// src/core/interfaces/services/IAdminCompanyManagementService.ts

import {
  CompanyPaginatedResponse,
  CompanySummaryDTO,
} from "../../dtos/response/admin/admin.company.response.dto";
export interface IAdminCompanyManagementService {
  getCompanyById(companyId: string): Promise<CompanySummaryDTO>;
  verifyCompany(
    companyId: string,
    status: "accepted" | "rejected",
    rejectionReason?: string
  ): Promise<CompanySummaryDTO>;
  blockCompany(companyId: string): Promise<CompanySummaryDTO>;
  unblockCompany(companyId: string): Promise<CompanySummaryDTO>;

  getCompanies(
    page: number,
    limit: number,
    searchQuery?: string
  ): Promise<CompanyPaginatedResponse>;
  // getUnverifiedCompanies(
  //   page: number,
  //   limit: number
  // ): Promise<CompanyPaginatedResponse>;
  getUnverifiedCompanies(
    page: number,
    limit: number
  ): Promise<CompanyPaginatedResponse>
}
