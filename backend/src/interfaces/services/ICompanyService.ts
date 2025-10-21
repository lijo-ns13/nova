import { CompanyProfileDTO } from "../../core/dtos/company/company.profile.dto";

export interface ICompanyService {
  getCompanyData(companyId: string): Promise<CompanyProfileDTO | null>;
}
