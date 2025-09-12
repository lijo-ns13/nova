import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { TYPES } from "../../di/types";
import { BaseRepository } from "./BaseRepository";
import { IAdminRepository } from "../../interfaces/repositories/IAdminRepository";
import { IAdmin } from "../entities/admin.entity";

@injectable()
export class AdminRepository
  extends BaseRepository<IAdmin>
  implements IAdminRepository
{
  constructor(@inject(TYPES.AdminModel) adminModel: Model<IAdmin>) {
    super(adminModel);
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return this.model.findOne({ email }).select("+password").exec();
  }
}
