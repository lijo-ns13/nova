import { inject, injectable } from "inversify";
import { TYPES } from "../../../di/types";
import { ISkill } from "../../database/models/skill.modal";
import { ISkillRepository } from "../../../core/interfaces/repositories/ISkillRepository";
import { IAdminSkillService } from "../../../core/interfaces/services/IAdminSkillService";

@injectable()
export class AdminSkillService implements IAdminSkillService {
  constructor(
    @inject(TYPES.SkillRepository)
    private skillRepository: ISkillRepository
  ) {}
  async create(title: string): Promise<ISkill> {
    if (!title.trim()) {
      throw new Error("Skill title cannot be empty");
    }
    const lowerTitle = title.trim();
    const existingSkill = await this.skillRepository.getByTitle(lowerTitle);
    if (existingSkill) {
      throw new Error("Skill already exists");
    }
    return this.skillRepository.create(title);
  }

  async update(id: string, updates: Partial<ISkill>): Promise<ISkill> {
    if (updates.title && !updates.title.trim()) {
      throw new Error("Skill title cannot be empty");
    }
    const lowerTitle = updates.title;
    if (lowerTitle) {
      const existingSkill = await this.skillRepository.getByTitle(lowerTitle);
      if (existingSkill) {
        throw new Error("Skill already exists");
      }
    }
    const updated = await this.skillRepository.update(id, updates);
    if (!updated) {
      throw new Error("Skill not found");
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const exists = await this.skillRepository.getById(id);
    if (!exists) {
      throw new Error("Skill not found");
    }

    const success = await this.skillRepository.delete(id);
    if (!success) {
      throw new Error("Failed to delete skill");
    }
  }

  async getAll(): Promise<ISkill[]> {
    return this.skillRepository.getAll();
  }
  async getById(id: string): Promise<ISkill> {
    const skill = await this.skillRepository.getById(id);
    if (!skill) {
      throw new Error("Skill not found");
    }
    return skill;
  }
}
