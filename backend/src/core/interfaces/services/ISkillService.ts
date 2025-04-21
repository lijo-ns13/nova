// src/core/interfaces/services/ISkillService.ts

import { ISkill } from "../../../infrastructure/database/models/skill.modal";

export interface ISkillService {
  create(title: string): Promise<ISkill>;
  update(id: string, updates: Partial<ISkill>): Promise<ISkill>;
  delete(id: string): Promise<void>;
  getAll(): Promise<ISkill[]>;
  getById(id: string): Promise<ISkill>;
}
