// src/interfaces/services/IAdminSkillService.ts
import {
  CreateSkillDto,
  UpdateSkillDto,
} from "../../core/dtos/admin/admin.skill.dto";
import {
  PaginatedSkillResponse,
  SkillResponseDto,
} from "../../dtos/response/admin/admin.skill.reponse.dto";

export interface IAdminSkillService {
  create(dto: CreateSkillDto, adminId: string): Promise<SkillResponseDto>;
  update(id: string, dto: UpdateSkillDto): Promise<SkillResponseDto>;
  delete(id: string): Promise<void>;
  getAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedSkillResponse>;
  getById(id: string): Promise<SkillResponseDto>;
}
