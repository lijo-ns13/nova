import { ISkill } from "../../models/skill.modal";
import { IUser } from "../../models/user.modal";

export interface IUserSkillService {
  getUserSkills(userId: string): Promise<ISkill[] | undefined>;
  addSkills(userId: string, skillTitles: string[]): Promise<IUser | null>;
  deleteSkill(userId: string, skillId: string): Promise<IUser | null>;
}
