import { SkillResponseDTO } from "../dtos/response/skill.response.dto";
import { ISkill } from "../repositories/entities/skill.entity";

export class SkillMapper {
  static toResponseDTO(skill: ISkill): SkillResponseDTO {
    return {
      id: skill._id.toString(),
      title: skill.title,
    };
  }

  static toSearchListDTO(skills: ISkill[]): SkillResponseDTO[] {
    return skills.map(this.toResponseDTO);
  }
}
