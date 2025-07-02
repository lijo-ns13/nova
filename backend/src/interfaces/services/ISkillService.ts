import { ISkill } from "../../models/skill.modal";

export interface ISkillService {
  /**
   * Search skills by a query string.
   * @param query - Search string
   * @returns List of matching skill titles
   */
  searchSkills(query: string): Promise<string[]>;

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
  addSkillToUser(userId: string, skillTitle: string): Promise<void>;

  /**
   * Remove a skill from the user's skill list.
   * @param userId - User's ObjectId (string)
   * @param skillId - Skill's ObjectId (string)
   * @returns True if update was successful
   */
  deleteSkillFromUser(userId: string, skillId: string): Promise<boolean>;
  getUserSkills(userId: string): Promise<Pick<ISkill, "_id" | "title">[]>;
}
