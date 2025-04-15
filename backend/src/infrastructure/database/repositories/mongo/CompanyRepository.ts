// src/infrastructure/database/repositories/mongo/CompanyRepository.ts
import { injectable } from "inversify";
import { Model } from "mongoose";
import { ICompanyRepository } from "../../../../core/interfaces/repositories/ICompanyRepository";
import companyModal, { ICompany } from "../../models/company.modal";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class CompanyRepository
  extends BaseRepository<ICompany>
  implements ICompanyRepository
{
  constructor() {
    super(companyModal as unknown as Model<ICompany>);
  }

  async findByEmail(email: string): Promise<ICompany | null> {
    return companyModal.findOne({ email }).exec();
  }

  async findByGoogleId(googleId: string): Promise<ICompany | null> {
    return companyModal.findOne({ googleId }).exec();
  }
}
