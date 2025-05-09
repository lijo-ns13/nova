import { ISkill } from "../../models/skill.modal";

export interface ISkillRepository {
  searchSkills(query: string, limit?: number): Promise<string[]>;
  create(skill: string): Promise<ISkill>;
  update(id: string, skill: Partial<ISkill>): Promise<ISkill | null>;
  delete(id: string): Promise<boolean>;
  getAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ skills: ISkill[]; total: number }>;
  getById(id: string): Promise<ISkill | null>;
  getByTitle(title: string): Promise<ISkill | null>;
}
