import { SkillResponseDto } from "../../dtos/response/admin/admin.skill.reponse.dto";
import { ISkill } from "../../models/skill.modal";

export class SkillMapper {
  static toResponse(skill: ISkill): SkillResponseDto {
    return {
      id: skill._id.toString(),
      title: skill.title,
      createdBy: skill.createdBy!,
    };
  }
}
