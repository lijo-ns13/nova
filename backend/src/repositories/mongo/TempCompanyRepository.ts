import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { ITempCompanyRepository } from "../../interfaces/repositories/ITempCompanyRepository";
import { BaseRepository } from "./BaseRepository";
import { TYPES } from "../../di/types";
import { ITempCompany } from "../entities/temp.comany.entity";
import companyTempModel from "../models/company.temp.model";

@injectable()
export class TempCompanyRepository
  extends BaseRepository<ITempCompany>
  implements ITempCompanyRepository
{
  constructor(
    @inject(TYPES.TempCompanyModel) companyTempModel: Model<ITempCompany>
  ) {
    super(companyTempModel);
  }

  async findByEmail(email: string): Promise<ITempCompany | null> {
    return this.model.findOne({ email }).select("+password").exec();
  }
}
