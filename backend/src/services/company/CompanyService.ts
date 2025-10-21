import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ICompanyRepository } from "../../interfaces/repositories/ICompanyRepository";
import { ICompanyService } from "../../interfaces/services/ICompanyService";
import { CompanyProfileDTO } from "../../core/dtos/company/company.profile.dto";
import { CompanyProfileMapper } from "../../mapping/company/company.profile.mapper";

@injectable()
export class CompanyService implements ICompanyService {
  constructor(
    @inject(TYPES.CompanyRepository)
    private readonly _companyRepo: ICompanyRepository
  ) {}

  async getCompanyData(companyId: string): Promise<CompanyProfileDTO | null> {
    const company = await this._companyRepo.findById(companyId);
    if (!company) return null;

    // map to DTO
    return CompanyProfileMapper.toDTO(company);
  }
}
