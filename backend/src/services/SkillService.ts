import { inject, injectable } from "inversify";
import { ISkillRepository } from "../interfaces/repositories/ISkillRepository";
import { TYPES } from "../di/types";
import { ISkillService } from "../interfaces/services/ISkillService";
import { ISkill } from "../models/skill.modal";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import mongoose, { Types } from "mongoose";
import { SkillMapper } from "../mapping/skill.mapper";
import { SkillResponeDTO } from "../dtos/response/skill.response.dto";

@injectable()
export class SkillService implements ISkillService {
  constructor(
    @inject(TYPES.SkillRepository)
    private _skillRepository: ISkillRepository,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository
  ) {}
  async searchSkills(query: string): Promise<SkillResponeDTO[]> {
    if (!query.trim()) return [];
    const skills = await this._skillRepository.searchSkills(query, 10);
    return SkillMapper.toSearchListDTO(skills);
  }
  async getByTitle(title: string): Promise<ISkill | null> {
    return this._skillRepository.getByTitle(title.trim().toLowerCase());
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
