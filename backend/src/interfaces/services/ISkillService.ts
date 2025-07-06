import { Types } from "mongoose";
import { ISkill } from "../../models/skill.modal";

import { SkillResponeDTO } from "../../dtos/response/skill.response.dto";

export interface ISkillService {
  /**
   * Search skills by a query string.
   * @param query - Search string
   * @returns List of matching skill titles
   */
  searchSkills(query: string): Promise<SkillResponeDTO[]>;

  /**
   * Get a skill by its normalized title.
   * @param title - Skill title
   * @returns Skill document or null
   */
  getByTitle(title: string): Promise<ISkill | null>;

  /**
   * Add a skill to the user. Creates the skill if it doesn't exist.
   * @param userId - User's ObjectId (string)
   * @param skillTitle - Title of the skill
   */

  getOrCreateSkills(
    skillTitles: string[],
    createdById: string,
    createdBy: "user" | "company" | "admin"
  ): Promise<Types.ObjectId[]>;
  findOrCreateSkillByTitle(
    title: string,
    createdById: string,
    createdBy: "user" | "company" | "admin"
  ): Promise<ISkill>;
}
