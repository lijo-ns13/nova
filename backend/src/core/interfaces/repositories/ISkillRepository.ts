import { ISkill } from "../../../infrastructure/database/models/skill.modal";

export interface ISkillRepository {
  searchSkills(query: string, limit?: number): Promise<string[]>;
  create(skill: string): Promise<ISkill>;
  update(id: string, skill: Partial<ISkill>): Promise<ISkill | null>;
  delete(id: string): Promise<boolean>;
  getAll(): Promise<ISkill[]>;
  getById(id: string): Promise<ISkill | null>;
  getByTitle(title: string): Promise<ISkill | null>;
}
