import { inject } from "inversify";
import { TYPES } from "../../di/types";
import { ICompanyRepository } from "../../interfaces/repositories/ICompanyRepository";
import { ICompanyService } from "../../interfaces/services/ICompanyService";
import { ICompany } from "../../repositories/entities/company.entity";
export class CompanyService implements ICompanyService {
  constructor(
    @inject(TYPES.CompanyRepository)
    private _companyRepo: ICompanyRepository
  ) {}
  async getCompanyData(companyId: string): Promise<ICompany | null> {
    return await this._companyRepo.findById(companyId);
  }
}
