// src/modules/admin/repositories/AdminRepository.ts
import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { TYPES } from "../../di/types";
import { BaseRepository } from "./BaseRepository";
import { IAdminRepository } from "../../interfaces/repositories/IAdminRepository";
import { IAdmin } from "../../models/admin.modal";

@injectable()
export class AdminRepository
  extends BaseRepository<IAdmin>
  implements IAdminRepository
{
  constructor(
    @inject(TYPES.AdminModal) adminModel: Model<IAdmin> // Make sure TYPES.AdminModel is mapped correctly in your DI container
  ) {
    super(adminModel);
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return this.model.findOne({ email }).select("+password").exec();
  }
}
