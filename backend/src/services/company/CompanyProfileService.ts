import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ICompanyRepository } from "../../interfaces/repositories/ICompanyRepository";
import { ICompanyProfileService } from "../../interfaces/services/ICompanyProfileService";
import { COMMON_MESSAGES } from "../../constants/message.constants";
import {
  CompanyProfileDTO,
  UpdateCompanyProfileInputType,
} from "../../core/dtos/company/company.profile.dto";
import { CompanyProfileMapper } from "../../mapping/company/company.profile.mapper";
import logger from "../../utils/logger";

@injectable()
export class CompanyProfileService implements ICompanyProfileService {
  private logger = logger.child({ service: "AdminAuthService" });

  constructor(
    @inject(TYPES.CompanyRepository)
    private readonly _companyRepository: ICompanyRepository
  ) {}

  async getCompanyProfile(companyId: string): Promise<CompanyProfileDTO> {
    const company = await this._companyRepository.getCompanyProfile(companyId);
    if (!company) throw new Error(COMMON_MESSAGES.COMPANY_NOT_FOUND);
    // mapping**
    return CompanyProfileMapper.toDTO(company);
  }

  async getCompanyProfileWithDetails(
    companyId: string
  ): Promise<CompanyProfileDTO> {
    const company = await this._companyRepository.getCompanyProfileWithDetails(
      companyId
    );
    if (!company) throw new Error(COMMON_MESSAGES.COMPANY_NOT_FOUND);
    // mapping**
    return CompanyProfileMapper.toDTO(company);
  }

  async updateCompanyProfile(
    companyId: string,
    data: UpdateCompanyProfileInputType
  ): Promise<CompanyProfileDTO> {
    if (data.username) {
      const username = data.username.trim().toLowerCase();
      const isValid = /^[a-zA-Z0-9_]{3,20}$/.test(username);
      if (!isValid) {
        throw new Error(
          "Invalid username format. Use 3–20 letters, numbers, or underscores."
        );
      }
      const isTaken = await this._companyRepository.isUsernameTaken(
        username,
        companyId
      );
      if (isTaken) {
        throw new Error("Username already exists, try another one.");
      }
      data.username = username;
    }

    const updated = await this._companyRepository.updateCompanyProfile(
      companyId,
      data
    );
    if (!updated) throw new Error("Failed to update company profile.");

    this.logger.info(`Company profile updated: ${companyId}`);
    return CompanyProfileMapper.toDTO(updated);
  }

  async updateProfileImage(
    companyId: string,
    imageUrl: string
  ): Promise<CompanyProfileDTO> {
    const updated = await this._companyRepository.updateProfileImage(
      companyId,
      imageUrl
    );
    if (!updated) throw new Error("Failed to update profile image");
    return CompanyProfileMapper.toDTO(updated);
  }

  async deleteProfileImage(companyId: string): Promise<boolean> {
    const deleted = await this._companyRepository.deleteProfileImage(companyId);
    if (!deleted) throw new Error("Failed to delete profile image");
    return true;
  }

  async changePassword(
    companyId: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> {
    if (newPassword !== confirmPassword) {
      throw new Error("New password and confirm password must match");
    }

    const success = await this._companyRepository.changePassword(
      companyId,
      currentPassword,
      newPassword
    );

    if (!success) {
      throw new Error("Failed to change password");
    }

    this.logger.info(`Password changed for company: ${companyId}`);
  }
}
