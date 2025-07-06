import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ICompanyRepository } from "../../interfaces/repositories/ICompanyRepository";
import { IAdminCompanyManagementService } from "../../interfaces/services/IAdminCompanyManagementService ";
import logger from "../../utils/logger";
import {
  CompanyPaginatedResponse,
  CompanySummaryDTO,
} from "../../dtos/response/admin/admin.company.response.dto";
import { CompanyMapper } from "../../mapping/admin/admin.company.mapper";
import { sendVerificationCompanyEmail } from "../../shared/util/email.verification.company";
import { buildCompanyVerificationEmail } from "../../shared/email/verificationEmailBuilder";
@injectable()
export class AdminCompanyManagementService
  implements IAdminCompanyManagementService
{
  private logger = logger.child({ service: "AdminCompanyManagementService" });
  constructor(
    @inject(TYPES.CompanyRepository)
    private _companyRepository: ICompanyRepository
  ) {}
  async deleteCompany(companyId: string) {
    return this._companyRepository.delete(companyId);
  }
  // async findCompanyById(companyId: string) {
  //   return this.getCompanyById(companyId);
  // }
  async getCompanyById(companyId: string): Promise<CompanySummaryDTO> {
    const company = await this._companyRepository.findById(companyId);
    if (!company) {
      this.logger.warn("admin not found");
      throw new Error("admin not found");
    }
    return CompanyMapper.toSummaryDTO(company);
  }
  async verifyCompany(
    companyId: string,
    status: "accepted" | "rejected",
    rejectionReason?: string
  ): Promise<CompanySummaryDTO> {
    this.logger.info(`Verifying company ${companyId} with status: ${status}`);

    const company = await this._companyRepository.findById(companyId);
    if (!company) {
      this.logger.warn(`Company not found: ${companyId}`);
      throw new Error("Company not found");
    }

    if (status === "accepted") {
      await this._companyRepository.updateCompany(companyId, {
        verificationStatus: status,
        isVerified: true,
      });
    } else {
      await this._companyRepository.delete(companyId);
    }

    const { subject, text, html } = buildCompanyVerificationEmail(
      status,
      company.companyName,
      rejectionReason
    );

    await sendVerificationCompanyEmail(company.email, subject, text, html);
    this.logger.info(`Verification email sent to ${company.email}`);

    return CompanyMapper.toSummaryDTO(company);
  }

  async blockCompany(companyId: string): Promise<CompanySummaryDTO> {
    const company = await this._companyRepository.updateCompany(companyId, {
      isBlocked: true,
    });
    if (!company) {
      logger.warn("company not found");
      throw new Error("company not found");
    }
    return CompanyMapper.toSummaryDTO(company);
  }

  async unblockCompany(companyId: string): Promise<CompanySummaryDTO> {
    const company = await this._companyRepository.updateCompany(companyId, {
      isBlocked: false,
    });
    if (!company) {
      logger.warn("company not found");
      throw new Error("company not found");
    }
    return CompanyMapper.toSummaryDTO(company);
  }

  // Get users with pagination
  async getCompanies(
    page: number,
    limit: number,
    searchQuery?: string
  ): Promise<CompanyPaginatedResponse> {
    const { companies, totalCompanies } =
      await this._companyRepository.findCompanies(page, limit, searchQuery);
    const summary = companies.map(CompanyMapper.toSummaryDTO);

    const totalPages = Math.ceil(totalCompanies / limit);
    return {
      companies: summary,
      pagination: {
        totalCompanies,
        totalPages,
        currentPage: page,
        companiesPerPage: limit,
      },
    };
  }

  async getUnverifiedCompanies(
    page: number,
    limit: number
  ): Promise<CompanyPaginatedResponse> {
    this.logger.info(
      `Fetching unverified companies: page=${page}, limit=${limit}`
    );

    const filter = { isVerified: false };
    if (page <= 0 || limit <= 0) {
      this.logger.warn(
        `Invalid pagination input: page=${page}, limit=${limit}`
      );
      throw new Error("Invalid pagination values");
    }

    const { companies, totalCompanies } =
      await this._companyRepository.findCompaniesByFilter(filter, page, limit);

    if (companies.length === 0) {
      this.logger.info("No unverified companies found.");
    }

    const summary = companies.map(CompanyMapper.toSummaryDTO);
    const totalPages = Math.ceil(totalCompanies / limit);

    this.logger.info(`Fetched ${summary.length} companies`);

    return {
      companies: summary,
      pagination: {
        totalCompanies,
        totalPages,
        currentPage: page,
        companiesPerPage: limit,
      },
    };
  }
}
