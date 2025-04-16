// src/infrastructure/database/repositories/mongo/CompanyRepository.ts
import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { ICompanyRepository } from "../../../../core/interfaces/repositories/ICompanyRepository";
import companyModal, { ICompany } from "../../models/company.modal";
import { BaseRepository } from "./BaseRepository";
import { TYPES } from "../../../../di/types";

@injectable()
export class CompanyRepository
  extends BaseRepository<ICompany>
  implements ICompanyRepository
{
  constructor(@inject(TYPES.CompanyModal) companyModal: Model<ICompany>) {
    super(companyModal);
  }

  // In CompanyRepository
  async findByEmail(email: string): Promise<ICompany | null> {
    return companyModal.findOne({ email }).select("+password").exec(); // Include password
  }

  async findByGoogleId(googleId: string): Promise<ICompany | null> {
    return companyModal.findOne({ googleId }).exec();
  }
}
