import { SignInCompanyResponseDTO } from "../../../core/dtos/company/company.signin.dto";
import { ICompany } from "../../../models/company.modal";

export class SignInCompanyMapper {
  static toDTO(
    company: ICompany,
    accessToken: string,
    refreshToken: string
  ): SignInCompanyResponseDTO {
    return {
      accessToken,
      refreshToken,
      company: {
        id: company._id.toString(),
        companyName: company.companyName,
        email: company.email,
        isVerified: company.isVerified,
        isBlocked: company.isBlocked,
        username: company.username,
      },
      isVerified: company.isVerified,
      isBlocked: company.isBlocked,
    };
  }
}
