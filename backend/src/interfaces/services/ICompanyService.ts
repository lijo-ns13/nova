import { ICompany } from "../../models/company.modal";

export interface ICompanyService {
  getCompanyData(companyId: string): Promise<ICompany | null>;
}
