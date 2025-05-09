// src/infrastructure/database/repositories/mongo/TempCompanyRepository.ts
import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { ITempCompanyRepository } from "../../interfaces/repositories/ITempCompanyRepository";
import companyTempModal, {
  ITempCompany,
} from "../../models/company.temp.modal";
import { BaseRepository } from "./BaseRepository";
import { TYPES } from "../../di/types";

@injectable()
export class TempCompanyRepository
  extends BaseRepository<ITempCompany>
  implements ITempCompanyRepository
{
  constructor(
    @inject(TYPES.TempCompanyModal) companyTempModal: Model<ITempCompany>
  ) {
    super(companyTempModal);
  }

  async findByEmail(email: string): Promise<ITempCompany | null> {
    return companyTempModal.findOne({ email }).select("+password").exec();
  }
}
