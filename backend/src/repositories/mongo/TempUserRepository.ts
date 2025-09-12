import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { ITempUserRepository } from "../../interfaces/repositories/ITempUserRepository";
import { BaseRepository } from "./BaseRepository";
import { TYPES } from "../../di/types";
import { ITempUser } from "../entities/tempuser.entity";
import userTempModel from "../models/user.temp.model";

@injectable()
export class TempUserRepository
  extends BaseRepository<ITempUser>
  implements ITempUserRepository
{
  constructor(@inject(TYPES.TempUserModel) userTempModel: Model<ITempUser>) {
    super(userTempModel);
  }
  async createTempUser(tempUserData: Partial<ITempUser>): Promise<ITempUser> {
    const tempUser = new this.model(tempUserData);
    return tempUser.save();
  }
  async findByEmail(email: string): Promise<ITempUser | null> {
    return this.model.findOne({ email }).select("+password").exec();
  }
}
