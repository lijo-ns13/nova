// src/services/admin/AdminSkillService.ts
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IAdminSkillService } from "../../interfaces/services/IAdminSkillService";
import { ISkillRepository } from "../../interfaces/repositories/ISkillRepository";
import {
  CreateSkillDto,
  UpdateSkillDto,
} from "../../core/dtos/admin/admin.skill.dto";

import { Logger } from "winston";
import logger from "../../utils/logger";
import { SkillMapper } from "../../mapping/admin/admin.skill.mapper";
import {
  PaginatedSkillResponse,
  SkillResponseDto,
} from "../../dtos/response/admin/admin.skill.reponse.dto";

@injectable()
export class AdminSkillService implements IAdminSkillService {
  private readonly logger: Logger;

  constructor(
    @inject(TYPES.SkillRepository)
    private readonly skillRepository: ISkillRepository
  ) {
    this.logger = logger.child({ context: "AdminSkillService" });
  }

  async create(
    dto: CreateSkillDto,
    adminId: string
  ): Promise<SkillResponseDto> {
    this.logger.info("Creating new skill", { title: dto.title, adminId });

    const lowerTitle = dto.title.trim().toLowerCase();
    const exists = await this.skillRepository.getByTitle(lowerTitle);
    if (exists) throw new Error("Skill already exists");

    const created = await this.skillRepository.createSkillAsAdmin(dto, adminId);
    return SkillMapper.toResponse(created);
  }

  async update(id: string, dto: UpdateSkillDto): Promise<SkillResponseDto> {
    this.logger.info("Updating skill", { id, title: dto.title });

    if (dto.title) {
      const lowerTitle = dto.title.trim().toLowerCase();
      const existing = await this.skillRepository.getByTitle(lowerTitle);
      if (existing && existing.id !== id)
        throw new Error("Skill already exists");
    }

    const updated = await this.skillRepository.update(id, dto);
    if (!updated) throw new Error("Skill not found");

    return SkillMapper.toResponse(updated);
  }

  async delete(id: string): Promise<void> {
    this.logger.info("Deleting skill", { id });

    const exists = await this.skillRepository.findById(id);
    if (!exists) throw new Error("Skill not found");

    const deleted = await this.skillRepository.delete(id);
    if (!deleted) throw new Error("Failed to delete skill");
  }

  async getAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedSkillResponse> {
    this.logger.info("Fetching skills list", { page, limit, search });

    const { skills, total } = await this.skillRepository.getAll(
      page,
      limit,
      search
    );
    return {
      skills: skills.map(SkillMapper.toResponse),
      total,
      page,
      limit,
    };
  }

  async getById(id: string): Promise<SkillResponseDto> {
    this.logger.info("Fetching skill by ID", { id });

    const skill = await this.skillRepository.findById(id);
    if (!skill) throw new Error("Skill not found");

    return SkillMapper.toResponse(skill);
  }
}
