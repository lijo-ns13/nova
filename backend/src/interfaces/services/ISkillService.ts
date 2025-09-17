import { SkillResponseDTO } from "../../dtos/response/skill.response.dto";

export interface ISkillService {
  searchSkills(query: string): Promise<SkillResponseDTO[]>;

  getByTitle(title: string): Promise<SkillResponseDTO | null>;

  getOrCreateSkills(
    skillTitles: string[],
    createdById: string,
    createdBy: "user" | "company" | "admin"
  ): Promise<SkillResponseDTO[]>;

  findOrCreateSkillByTitle(
    title: string,
    createdById: string,
    createdBy: "user" | "company" | "admin"
  ): Promise<SkillResponseDTO>;
}
