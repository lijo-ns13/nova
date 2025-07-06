import { SkillResponeDTO } from "../dtos/response/skill.response.dto";
import { ISkill } from "../models/skill.modal";

export class SkillMapper {
  static toSearchListDTO(skills: ISkill[]): SkillResponeDTO[] {
    return skills.map((skill) => ({
      title: skill.title,
    }));
  }
}
