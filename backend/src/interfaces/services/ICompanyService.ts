import { ICompany } from "../../repositories/entities/company.entity";

export interface ICompanyService {
  getCompanyData(companyId: string): Promise<ICompany | null>;
}
