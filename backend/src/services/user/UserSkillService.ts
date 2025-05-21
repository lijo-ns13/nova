import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUser } from "../../models/user.modal";

import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IUserSkillService } from "../../interfaces/services/IUserSkillService";
import mongoose from "mongoose";
import { ISkill } from "../../models/skill.modal";

@injectable()
export class UserSkillService implements IUserSkillService {
  constructor(
    @inject(TYPES.UserRepository)
    private _userRepo: IUserRepository
  ) {}

  async getUserSkills(userId: string): Promise<ISkill[] | undefined> {
    return await this._userRepo.getUserSkillsById(userId);
  }

  async addSkills(userId: string, skillIds: string[]): Promise<IUser | null> {
    const objectIds = skillIds.map((id) => new mongoose.Types.ObjectId(id));
    return await this._userRepo.addSkillsToUser(userId, objectIds);
  }

  async deleteSkill(userId: string, skillId: string): Promise<IUser | null> {
    return await this._userRepo.deleteUserSkill(userId, skillId);
  }
}
