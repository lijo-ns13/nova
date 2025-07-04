import { inject, injectable } from "inversify";
import { ISkillRepository } from "../interfaces/repositories/ISkillRepository";
import { TYPES } from "../di/types";
import { ISkillService } from "../interfaces/services/ISkillService";
import { ISkill } from "../models/skill.modal";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import mongoose, { Types } from "mongoose";
import userModal from "../models/user.modal";

@injectable()
export class SkillService implements ISkillService {
  constructor(
    @inject(TYPES.SkillRepository)
    private _skillRepository: ISkillRepository,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository
  ) {}
  async searchSkills(query: string): Promise<string[]> {
    if (!query.trim()) return [];
    return this._skillRepository.searchSkills(query);
  }
  async getByTitle(title: string): Promise<ISkill | null> {
    return this._skillRepository.getByTitle(title.trim().toLowerCase());
  }
  async addSkillToUser(userId: string, skillTitle: string): Promise<void> {
    const normalized = skillTitle.trim().toLowerCase();

    let skill = await this._skillRepository.getByTitle(normalized);
    if (!skill) {
      const skillData = {
        title: normalized,
        createdById: new Types.ObjectId(userId),
        createdBy: "user" as const,
      };
      skill = await this._skillRepository.create(skillData);
    }
    await this._userRepo.update(userId, {
      $addToSet: { skills: skill._id },
    });
  }
  async deleteSkillFromUser(userId: string, skillId: string): Promise<boolean> {
    const skill = await this._skillRepository.findById(skillId);
    if (!skill) {
      throw new Error("skill not found");
    }
    const res = await this._userRepo.update(userId, {
      $pull: { skills: new Types.ObjectId(skillId) },
    });
    return !!res;
  }
  async getUserSkills(
    userId: string
  ): Promise<Pick<ISkill, "_id" | "title">[]> {
    const user = await this._userRepo.findOne(
      { _id: userId },
      {
        path: "skills",
        select: "_id title",
      }
    );

    console.log("User from DB:", user); // Check the complete user object
    console.log("User skills:", user?.skills); // Check what skills are returned

    if (!user || !user.skills) return [];

    return (user.skills as ISkill[]).map((skill) => ({
      _id: skill._id,
      title: skill.title,
    }));
  }
  async getOrCreateSkills(
    skillTitles: string[],
    createdById: string,
    createdBy: "user" | "company" | "admin"
  ): Promise<Types.ObjectId[]> {
    const skillIds: Types.ObjectId[] = [];

    for (const title of skillTitles) {
      let skill = await this._skillRepository.findOne({ title });

      if (!skill) {
        skill = await this._skillRepository.create({
          title,
          createdById: new mongoose.Types.ObjectId(createdById),
          createdBy,
        });
      }

      skillIds.push(skill._id);
    }

    return skillIds;
  }

  // ✅ New method
  async findOrCreateSkillByTitle(
    title: string,
    createdById: string,
    createdBy: "user" | "company" | "admin"
  ): Promise<ISkill> {
    let skill = await this._skillRepository.findOne({ title });

    if (!skill) {
      skill = await this._skillRepository.create({
        title,
        createdById: new mongoose.Types.ObjectId(createdById),
        createdBy,
      });
    }

    return skill;
  }
}
