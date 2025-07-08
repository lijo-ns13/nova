import { CreateSkillDto } from "../../core/dtos/admin/admin.skill.dto";
import { ISkill } from "../../models/skill.modal";
import { IBaseRepository } from "./IBaseRepository";

export interface ISkillRepository extends IBaseRepository<ISkill> {
  createSkillAsAdmin(dto: CreateSkillDto, adminId: string): Promise<ISkill>;
  findOrCreateByTitle(
    title: string,
    createdById: string,
    createdBy: "company" | "user" | "admin"
  ): Promise<ISkill>;
  createSkill(
    title: string,
    createdById: string,
    createdBy: "user" | "company" | "admin"
  ): Promise<ISkill>;

  findByTitle(title: string): Promise<ISkill | null>;

  createSkillWith(
    title: string,
    createdById: string,
    createdBy: "user" | "company" | "admin"
  ): Promise<ISkill>;
  searchSkills(query: string, limit: number): Promise<ISkill[]>;
  // create(skill: string): Promise<ISkill>;
  // update(id: string, skill: Partial<ISkill>): Promise<ISkill | null>;
  // delete(id: string): Promise<boolean>;
  getAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ skills: ISkill[]; total: number }>;
  // getById(id: string): Promise<ISkill | null>;
  getByTitle(title: string): Promise<ISkill | null>;
}
