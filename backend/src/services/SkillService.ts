import { inject, injectable } from "inversify";
import { ISkillRepository } from "../interfaces/repositories/ISkillRepository";
import { TYPES } from "../di/types";
import { ISkillService } from "../interfaces/services/ISkillService";
import { ISkill } from "../models/skill.modal";

@injectable()
export class SkillService implements ISkillService {
  constructor(
    @inject(TYPES.SkillRepository)
    private _skillRepository: ISkillRepository
  ) {}
  async searchSkills(query: string): Promise<string[]> {
    if (!query.trim()) return [];
    return this._skillRepository.searchSkills(query);
  }
  async getByTitle(title: string): Promise<ISkill | null> {
    return this._skillRepository.getByTitle(title.trim().toLowerCase());
  }

  async create(title: string): Promise<ISkill> {
    return this._skillRepository.create(title.trim().toLowerCase());
  }
}
