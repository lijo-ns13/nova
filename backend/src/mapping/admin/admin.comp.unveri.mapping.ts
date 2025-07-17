import { CompanyBaseDTO } from "../../core/dtos/admin/company.unveri.dto";
import { ICompany } from "../../models/company.modal";

export class CompanyUnVerifiedMapper {
  static toBase(company: ICompany): CompanyBaseDTO {
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
