import { CompanyDashboardDTO } from "../../mapping/company/company.dash.mapper";

export interface ICompanyDashboardService {
  getCompanyDashboardStats(companyId: string): Promise<CompanyDashboardDTO>;
}
