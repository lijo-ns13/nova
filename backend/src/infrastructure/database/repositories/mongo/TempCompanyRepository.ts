// src/infrastructure/database/repositories/mongo/TempCompanyRepository.ts
import { injectable } from "inversify";
import { Model } from "mongoose";
import { ITempCompanyRepository } from "../../../../core/interfaces/repositories/ITempCompanyRepository";
import companyTempModal, {
  ITempCompany,
} from "../../models/company.temp.modal";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class TempCompanyRepository
  extends BaseRepository<ITempCompany>
  implements ITempCompanyRepository
{
  constructor() {
    super(companyTempModal as unknown as Model<ITempCompany>);
  }

  async findByEmail(email: string): Promise<ITempCompany | null> {
    return companyTempModal.findOne({ email }).select("+password").exec();
  }
}
