import { ICompany } from "../../repositories/entities/company.entity";

export interface ICompanyProfileService {
  getCompanyProfile(companyId: string): Promise<ICompany>;
  getCompanyProfileWithDetails(companyId: string): Promise<ICompany>;
  updateCompanyProfile(
    companyId: string,
    data: Partial<ICompany>
  ): Promise<ICompany>;
  updateProfileImage(companyId: string, imageUrl: string): Promise<ICompany>;
  deleteProfileImage(companyId: string): Promise<boolean>;
  changePassword(
    companyId: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void>;
}
