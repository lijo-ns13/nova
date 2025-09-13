import {
  SignInCompanyRequestDTO,
  SignInCompanyResponseDTO,
} from "../../../core/dtos/company/company.signin.dto";
import {
  CompanySigninEntity,
  ICompany,
} from "../../../repositories/entities/company.entity";

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
  static fromDTO(dto: SignInCompanyRequestDTO): CompanySigninEntity {
    return {
      email: dto.email.toLowerCase().trim(),
      password: dto.password.trim(),
    };
  }
}
