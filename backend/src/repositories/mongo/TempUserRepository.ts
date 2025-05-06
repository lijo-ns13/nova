import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { ITempUser } from "../../models/user.temp.modal";
import { ITempUserRepository } from "../../core/interfaces/repositories/ITempUserRepository";
import userTempModal from "../../models/user.temp.modal";
import { BaseRepository } from "./BaseRepository";
import { TYPES } from "../../di/types";

@injectable()
export class TempUserRepository
  extends BaseRepository<ITempUser>
  implements ITempUserRepository
{
  constructor(@inject(TYPES.TempUserModal) userTempModal: Model<ITempUser>) {
    super(userTempModal);
  }
  async createTempUser(tempUserData: Partial<ITempUser>): Promise<ITempUser> {
    const tempUser = new userTempModal(tempUserData);
    return tempUser.save();
  }
  async findByEmail(email: string): Promise<ITempUser | null> {
    return userTempModal.findOne({ email }).select("+password").exec();
  }
}
