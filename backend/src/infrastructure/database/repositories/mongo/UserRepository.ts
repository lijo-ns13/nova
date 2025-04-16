import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { IUserRepository } from "../../../../core/interfaces/repositories/IUserRepository";
import userModal, { IUser } from "../../models/user.modal";
import { BaseRepository } from "./BaseRepository";
import { TYPES } from "../../../../di/types";

@injectable()
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor(@inject(TYPES.UserModal) userModal: Model<IUser>) {
    super(userModal);
  }
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return this.create(userData); // calls BaseRepository.create()
  }

  async findByEmail(email: string, isPassword = false): Promise<IUser | null> {
    const query = userModal.findOne({ email });
    return isPassword ? query.select("+password") : query;
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await userModal.findByIdAndUpdate(userId, { password: newPassword });
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return userModal.findOne({ googleId });
  }

  async addToAppliedJobs(userId: string, jobId: string): Promise<void> {
    await userModal.findByIdAndUpdate(userId, {
      $addToSet: { appliedJobs: jobId },
    });
  }

  async addToSavedJobs(userId: string, jobId: string): Promise<void> {
    await userModal.findByIdAndUpdate(userId, {
      $addToSet: { savedJobs: jobId },
    });
  }

  async removeFromSavedJobs(userId: string, jobId: string): Promise<void> {
    await userModal.findByIdAndUpdate(userId, {
      $pull: { savedJobs: jobId },
    });
  }

  async getSavedJobs(userId: string): Promise<IUser | null> {
    return userModal.findById(userId).populate("savedJobs");
  }

  async getAppliedJobs(userId: string): Promise<IUser | null> {
    return userModal.findById(userId).populate("appliedJobs");
  }
}
