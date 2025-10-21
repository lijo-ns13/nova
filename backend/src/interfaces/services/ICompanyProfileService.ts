import {
  CompanyProfileDTO,
  UpdateCompanyProfileInputType,
} from "../../core/dtos/company/company.profile.dto";

export interface ICompanyProfileService {
  getCompanyProfile(companyId: string): Promise<CompanyProfileDTO>;
  getCompanyProfileWithDetails(companyId: string): Promise<CompanyProfileDTO>;
  updateCompanyProfile(
    companyId: string,
    data: UpdateCompanyProfileInputType
  ): Promise<CompanyProfileDTO>;
  updateProfileImage(
    companyId: string,
    imageUrl: string
  ): Promise<CompanyProfileDTO>;
  deleteProfileImage(companyId: string): Promise<boolean>;
  changePassword(
    companyId: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void>;
}
