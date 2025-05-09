// src/core/interfaces/services/ISkillService.ts

import { ISkill } from "../../models/skill.modal";

export interface IAdminSkillService {
  create(title: string): Promise<ISkill>;
  update(id: string, updates: Partial<ISkill>): Promise<ISkill>;
  delete(id: string): Promise<void>;
  getAll(
    page?: number,
    limit?: number,
    search?: string
  ): Promise<{ skills: ISkill[]; total: number; page: number; limit: number }>;
  getById(id: string): Promise<ISkill>;
}
