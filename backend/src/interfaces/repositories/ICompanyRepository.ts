// src/core/interfaces/repositories/ICompanyRepository.ts
import { IBaseRepository } from "./IBaseRepository";
import { ICompany } from "../../models/company.modal";

export interface ICompanyRepository extends IBaseRepository<ICompany> {
  findByEmail(email: string): Promise<ICompany | null>;
  findByGoogleId(googleId: string): Promise<ICompany | null>;
  findById(companyId: string): Promise<ICompany | null>;
  updateCompany(
    companyId: string,
    updateData: Partial<ICompany>
  ): Promise<ICompany | null>;
  deleteCompany(companyId: string): Promise<ICompany | null>;

  findCompanies(
    page: number,
    limit: number,
    searchQuery?: string
  ): Promise<{ companies: ICompany[]; totalCompanies: number }>;

  findCompaniesByFilter(
    filter: Record<string, any>,
    page?: number,
    limit?: number
  ): Promise<{
    companies: ICompany[];
    totalCompanies: number;
  }>;
}
