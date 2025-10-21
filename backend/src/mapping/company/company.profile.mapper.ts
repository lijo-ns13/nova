import { CompanyProfileDTO } from "../../core/dtos/company/company.profile.dto";
import { ICompany } from "../../repositories/entities/company.entity";

export class CompanyProfileMapper {
  static toDTO(company: ICompany): CompanyProfileDTO {
    return {
      id: company._id.toString(),
      companyName: company.companyName,
      username: company.username,
      about: company.about ?? null,
      email: company.email,
      industryType: company.industryType ?? null,
      foundedYear: company.foundedYear ?? null,
      website: company.website ?? null,
      location: company.location ?? null,
      companySize: company.companySize ?? null,
      isVerified: company.isVerified,
      verificationStatus: company.verificationStatus,
      isBlocked: company.isBlocked,
      profilePicture: company.profilePicture ?? null,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }
}
