import { SkillResponseDto } from "../../dtos/response/admin/admin.skill.reponse.dto";
import {
  ISkill,
  SkillIdEntity,
  SkillTitleEntity,
} from "../../repositories/entities/skill.entity";

export class SkillMapper {
  static toDTO(skill: ISkill): SkillResponseDto {
    return {
      id: skill._id.toString(),
      title: skill.title,
      createdBy: skill.createdBy!,
    };
  }

  static fromDTO(
    dto: SkillTitleEntity,
    createdBy: "user" | "company" | "admin"
  ): Partial<ISkill> {
    return {
      title: dto.title.trim(),
      createdBy,
    };
  }

  static fromBaseDTO(dto: string): SkillTitleEntity {
    return {
      title: dto.trim(),
    };
  }
  static idFromDTO(dto: SkillIdEntity): SkillIdEntity {
    return {
      id: dto.id,
    };
  }
}
