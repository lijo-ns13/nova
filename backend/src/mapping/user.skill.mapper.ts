import { SkillUserResponseDTO } from "../dtos/response/user.skill.response.dto";
import { ISkill } from "../repositories/entities/skill.entity";

export class SkillUserMapper {
  static toDTO(skill: ISkill): SkillUserResponseDTO {
    return {
      id: skill._id.toString(),
      title: skill.title,
    };
  }
}
