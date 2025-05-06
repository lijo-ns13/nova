import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISkill } from "../../models/skill.modal";
import { ISkillRepository } from "../../core/interfaces/repositories/ISkillRepository";
import { IAdminSkillService } from "../../core/interfaces/services/IAdminSkillService";

@injectable()
export class AdminSkillService implements IAdminSkillService {
  constructor(
    @inject(TYPES.SkillRepository)
    private _skillRepository: ISkillRepository
  ) {}
  async create(title: string): Promise<ISkill> {
    if (!title.trim()) {
      throw new Error("Skill title cannot be empty");
    }
    const lowerTitle = title.trim();
    const existingSkill = await this._skillRepository.getByTitle(lowerTitle);
    if (existingSkill) {
      throw new Error("Skill already exists");
    }
    return this._skillRepository.create(title);
  }

  async update(id: string, updates: Partial<ISkill>): Promise<ISkill> {
    if (updates.title && !updates.title.trim()) {
      throw new Error("Skill title cannot be empty");
    }
    const lowerTitle = updates.title;
    if (lowerTitle) {
      const existingSkill = await this._skillRepository.getByTitle(lowerTitle);
      if (existingSkill) {
        throw new Error("Skill already exists");
      }
    }
    const updated = await this._skillRepository.update(id, updates);
    if (!updated) {
      throw new Error("Skill not found");
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const exists = await this._skillRepository.getById(id);
    if (!exists) {
      throw new Error("Skill not found");
    }

    const success = await this._skillRepository.delete(id);
    if (!success) {
      throw new Error("Failed to delete skill");
    }
  }

  async getAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{
    skills: ISkill[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10;

    const { skills, total } = await this._skillRepository.getAll(
      page,
      limit,
      search
    );
    console.log("skilss", skills, total);
    return {
      skills,
      total,
      page,
      limit,
    };
  }
  async getById(id: string): Promise<ISkill> {
    const skill = await this._skillRepository.getById(id);
    if (!skill) {
      throw new Error("Skill not found");
    }
    return skill;
  }
}
