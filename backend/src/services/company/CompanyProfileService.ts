import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ICompanyRepository } from "../../interfaces/repositories/ICompanyRepository";
import { ICompanyProfileService } from "../../interfaces/services/ICompanyProfileService";
import { ICompany } from "../../models/company.modal";

@injectable()
export class CompanyProfileService implements ICompanyProfileService {
  constructor(
    @inject(TYPES.CompanyRepository)
    private _companyRepository: ICompanyRepository
  ) {
    console.log("ProfileRepo", this._companyRepository);
  }

  async getCompanyProfile(companyId: string): Promise<ICompany> {
    const company = await this._companyRepository.getCompanyProfile(companyId);
    if (!company) throw new Error("Company not found");
    return company;
  }

  async getCompanyProfileWithDetails(companyId: string): Promise<ICompany> {
    const company = await this._companyRepository.getCompanyProfileWithDetails(
      companyId
    );
    if (!company) throw new Error("Company not found");
    return company;
  }

  async updateCompanyProfile(
    companyId: string,
    data: Partial<ICompany>
  ): Promise<ICompany> {
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
    return updated;
  }

  async updateProfileImage(
    companyId: string,
    imageUrl: string
  ): Promise<ICompany> {
    const updated = await this._companyRepository.updateProfileImage(
      companyId,
      imageUrl
    );
    if (!updated) throw new Error("Failed to update profile image");
    return updated;
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
  }
}
