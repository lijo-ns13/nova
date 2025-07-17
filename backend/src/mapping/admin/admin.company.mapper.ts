import { ICompany } from "../../models/company.modal";
import { CompanySummaryDTO } from "../../dtos/response/admin/admin.company.response.dto";

export class CompanyMapper {
  static toSummaryDTO(company: ICompany): CompanySummaryDTO {
    return {
      id: company._id.toString(),
      companyName: company.companyName,
      email: company.email,
      isBlocked: company.isBlocked,
    };
  }
}
