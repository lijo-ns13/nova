// src/core/interfaces/repositories/ICompanyRepository.ts
import { ICompany } from "../../repositories/entities/company.entity";
import { IBaseRepository } from "./IBaseRepository";

export interface ICompanyRepository extends IBaseRepository<ICompany> {
  findByEmail(email: string): Promise<ICompany | null>;
  findByGoogleId(googleId: string): Promise<ICompany | null>;
  findById(companyId: string): Promise<ICompany | null>;
  updateCompany(
    companyId: string,
    updateData: Partial<ICompany>
  ): Promise<ICompany | null>;
  deleteCompany(companyId: string): Promise<ICompany | null>;
  updatePassword(companyId: string, newPassword: string): Promise<void>;
  findCompanies(
    page: number,
    limit: number,
    searchQuery?: string
  ): Promise<{ companies: ICompany[]; totalCompanies: number }>;

  // findCompaniesByFilter(
  //   filter: Record<string, any>,
  //   page?: number,
  //   limit?: number
  // ): Promise<{
  //   companies: ICompany[];
  //   totalCompanies: number;
  // }>;
  getPendingVerificationCompanies(
    page?: number,
    limit?: number
  ): Promise<{ companies: ICompany[]; totalCompanies: number }>;
  getCompanyProfile(companyId: string): Promise<ICompany | null>;
  getCompanyProfileWithDetails(companyId: string): Promise<ICompany | null>;
  updateCompanyProfile(
    companyId: string,
    data: Partial<ICompany>
  ): Promise<ICompany | null>;
  updateProfileImage(
    companyId: string,
    imageUrl: string
  ): Promise<ICompany | null>;
  deleteProfileImage(companyId: string): Promise<boolean>;
  changePassword(
    companyId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean>;
  isUsernameTaken(
    username: string,
    excludeCompanyId?: string
  ): Promise<boolean>;
}
