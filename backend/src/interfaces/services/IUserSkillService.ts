import { SkillUserResponseDTO } from "../../dtos/response/user.skill.response.dto";
export interface IUserSkillService {
  addSkillToUser(userId: string, skillTitle: string): Promise<void>;
  deleteSkillFromUser(userId: string, skillId: string): Promise<void>;
  getUserSkills(userId: string): Promise<SkillUserResponseDTO[]>;
}
