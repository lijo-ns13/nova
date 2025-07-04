import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUser } from "../../models/user.modal";

import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IUserSkillService } from "../../interfaces/services/IUserSkillService";
import mongoose from "mongoose";
import { ISkill } from "../../models/skill.modal";
import { ISkillService } from "../../interfaces/services/ISkillService";
import { ISkillRepository } from "../../interfaces/repositories/ISkillRepository";

@injectable()
export class UserSkillService implements IUserSkillService {
  constructor(
    @inject(TYPES.UserRepository)
    private _userRepo: IUserRepository,
    @inject(TYPES.SkillService)
    private _skillRepo: ISkillRepository
  ) {}

  async getUserSkills(userId: string): Promise<ISkill[] | undefined> {
    return await this._userRepo.getUserSkillsById(userId);
  }

  async addSkills(
    userId: string,
    skillTitles: string[]
  ): Promise<IUser | null> {
    const skillIds = await Promise.all(
      skillTitles.map(async (title) => {
        title = title.trim().toLowerCase();
        let skill = await this._skillRepo.getByTitle(title);
        if (!skill) {
          skill = await this._skillRepo.create({
            title,
            createdById: new mongoose.Types.ObjectId(userId),
            createdBy: "user",
          });
        }
        return new mongoose.Types.ObjectId(skill._id);
      })
    );

    return await this._userRepo.addSkillsToUser(userId, skillIds);
  }

  async deleteSkill(userId: string, skillId: string): Promise<IUser | null> {
    return await this._userRepo.deleteUserSkill(userId, skillId);
  }
}
