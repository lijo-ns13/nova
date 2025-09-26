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
import { IMediaService } from "../../interfaces/services/Post/IMediaService";

import { UnverifiedCompanyMapper } from "../../mapping/admin/admin.comp.unveri.mapping";
import { CompanyWithSignedDocsDTO } from "../../core/dtos/admin/company.unveri.dto";
import { COMMON_MESSAGES } from "../../constants/message.constants";
@injectable()
export class AdminCompanyManagementService
  implements IAdminCompanyManagementService
{
  private logger = logger.child({ service: "AdminCompanyManagementService" });
  constructor(
    @inject(TYPES.CompanyRepository)
    private readonly _companyRepository: ICompanyRepository,
    @inject(TYPES.MediaService) private readonly _mediaService: IMediaService
  ) {}
  
  async getCompanyById(companyId: string): Promise<CompanySummaryDTO> {
    const company = await this._companyRepository.findById(companyId);
    if (!company) {
      this.logger.warn(COMMON_MESSAGES.ADMIN_NOT_FOUND);
      throw new Error(COMMON_MESSAGES.ADMIN_NOT_FOUND);
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
      this.logger.warn(COMMON_MESSAGES.COMPANY_NOT_FOUND);
      throw new Error(COMMON_MESSAGES.COMPANY_NOT_FOUND);
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
      logger.warn(COMMON_MESSAGES.COMPANY_NOT_FOUND);
      throw new Error(COMMON_MESSAGES.COMPANY_NOT_FOUND);
    }
    return CompanyMapper.toSummaryDTO(company);
  }

  async unblockCompany(companyId: string): Promise<CompanySummaryDTO> {
    const company = await this._companyRepository.updateCompany(companyId, {
      isBlocked: false,
    });
    if (!company) {
      logger.warn(COMMON_MESSAGES.COMPANY_NOT_FOUND);
      throw new Error(COMMON_MESSAGES.COMPANY_NOT_FOUND);
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
      // mapping
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

    if (page <= 0 || limit <= 0) {
      this.logger.warn(
        `Invalid pagination values: page=${page}, limit=${limit}`
      );
      throw new Error("Invalid pagination input");
    }

    const { companies, totalCompanies } =
      await this._companyRepository.getPendingVerificationCompanies(
        page,
        limit
      );

    const updatedCompanies: CompanyWithSignedDocsDTO[] = await Promise.all(
      companies.map(async (company) => {
        const signedDocUrls = await Promise.all(
          company.documents.map((s3Key: string) =>
            this._mediaService.getMediaUrl(s3Key)
          )
        );

        const baseDTO = UnverifiedCompanyMapper.toDTO(company); // no signed URLs

        return {
          ...baseDTO,
          documents: signedDocUrls,
        };
      })
    );

    const totalPages = Math.ceil(totalCompanies / limit);

    return {
      companies: updatedCompanies,
      pagination: {
        totalCompanies,
        totalPages,
        currentPage: page,
        companiesPerPage: limit,
      },
    };
  }
  async deleteCompany(companyId: string) {
    return this._companyRepository.delete(companyId);
  }
}
