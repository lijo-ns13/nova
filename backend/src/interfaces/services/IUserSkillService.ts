import { SkillUserResponseDTO } from "../../dtos/response/user.skill.response.dto";
export interface IUserSkillService {
  addSkillToUser(
    userId: string,
    title: string
  ): Promise<SkillUserResponseDTO[]>;
  deleteSkillFromUser(userId: string, skillId: string): Promise<void>;
  getUserSkills(userId: string): Promise<SkillUserResponseDTO[]>;
}
