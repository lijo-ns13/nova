import { CompanyIdDTO } from "../../core/validations/admin/admin.company.validation";
import { CompanySummaryDTO } from "../../dtos/response/admin/admin.company.response.dto";
import {
  CompanyIdEntity,
  ICompany,
} from "../../repositories/entities/company.entity";

export class CompanyMapper {
  static toSummaryDTO(company: ICompany): CompanySummaryDTO {
    return {
      id: company._id.toString(),
      companyName: company.companyName,
      email: company.email,
      isBlocked: company.isBlocked,
    };
  }
  static fromDTO(dto: CompanyIdDTO): CompanyIdEntity {
    return {
      companyId: dto.companyId.trim(),
    };
  }
}
