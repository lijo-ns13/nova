import { ISkill } from "../../models/skill.modal";

export interface ISkillService {
  searchSkills(query: string): Promise<string[]>;
  getByTitle(title: string): Promise<ISkill | null>;
  create(title: string): Promise<ISkill>;
}
