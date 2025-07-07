// src/core/dtos/response/admin.skill.response.dto.ts
export interface SkillResponseDto {
  id: string;
  title: string;
  createdBy: "admin" | "user" | "company";
}
export type PaginatedSkillResponse = {
  skills: SkillResponseDto[];
  total: number;
  page: number;
  limit: number;
};
