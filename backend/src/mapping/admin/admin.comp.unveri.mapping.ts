import { CompanyBaseDTO } from "../../core/dtos/admin/company.unveri.dto";
import { ICompany } from "../../repositories/entities/company.entity";

export class UnverifiedCompanyMapper {
  static toDTO(company: ICompany): CompanyBaseDTO {
    return {
      id: company._id.toString(),
      companyName: company.companyName,
      email: company.email,
      industryType: company.industryType,
      isVerified: company.isVerified,
      verificationStatus: company.verificationStatus,
      isBlocked: company.isBlocked,
    };
  }
}
