import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISkill } from "../../models/skill.modal";
import { ISkillRepository } from "../../interfaces/repositories/ISkillRepository";
import { IAdminSkillService } from "../../interfaces/services/IAdminSkillService";
import mongoose from "mongoose";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { ICompanyRepository } from "../../interfaces/repositories/ICompanyRepository";
import { IAdminRepository } from "../../interfaces/repositories/IAdminRepository";
import { SkillWithCreatorEmail } from "../../core/entities/skilladmin";

@injectable()
export class AdminSkillService implements IAdminSkillService {
  constructor(
    @inject(TYPES.SkillRepository)
    private _skillRepository: ISkillRepository,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.CompanyRepository) private _companyRepo: ICompanyRepository,
    @inject(TYPES.AdminRepository) private _adminRepo: IAdminRepository
  ) {}
  async create(title: string, adminId: string): Promise<ISkill> {
    if (!title.trim()) {
      throw new Error("Skill title cannot be empty");
    }
    const lowerTitle = title.trim();
    const existingSkill = await this._skillRepository.getByTitle(lowerTitle);
    if (existingSkill) {
      throw new Error("Skill already exists");
    }
    return this._skillRepository.create({
      title,
      createdById: new mongoose.Types.ObjectId(adminId),
      createdBy: "admin",
    });
  }

  async update(id: string, updates: Partial<ISkill>): Promise<ISkill> {
    if (updates.title && !updates.title.trim()) {
      throw new Error("Skill title cannot be empty");
    }
    const lowerTitle = updates.title;
    if (lowerTitle) {
      const existingSkill = await this._skillRepository.getByTitle(lowerTitle);
      if (existingSkill) {
        throw new Error("Skill already exists");
      }
    }
    const updated = await this._skillRepository.update(id, updates);
    if (!updated) {
      throw new Error("Skill not found");
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const exists = await this._skillRepository.findById(id);
    if (!exists) {
      throw new Error("Skill not found");
    }

    const success = await this._skillRepository.delete(id);
    if (!success) {
      throw new Error("Failed to delete skill");
    }
  }

  async getAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{
    skills: ISkill[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10;

    const { skills, total } = await this._skillRepository.getAll(
      page,
      limit,
      search
    );
    console.log("skilss", skills, total);
    return {
      skills,
      total,
      page,
      limit,
    };
  }
  async getById(id: string): Promise<SkillWithCreatorEmail> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid skill ID");
    }

    const skill = await this._skillRepository.findById(id);
    if (!skill) {
      throw new Error("Skill not found");
    }

    if (!skill.createdById) {
      throw new Error("Skill does not have a creator ID");
    }

    let creatorEmail: string;

    if (skill.createdBy === "user") {
      const user = await this._userRepo.findById(skill.createdById.toString());
      if (!user) throw new Error("User not found");
      creatorEmail = user.email;
    } else if (skill.createdBy === "company") {
      const company = await this._companyRepo.findById(
        skill.createdById.toString()
      );
      if (!company) throw new Error("Company not found");
      creatorEmail = company.email;
    } else if (skill.createdBy === "admin") {
      const admin = await this._adminRepo.findById(
        skill.createdById.toString()
      );
      if (!admin) throw new Error("Admin not found");
      creatorEmail = admin.email;
    } else {
      throw new Error("Unknown creator type");
    }

    return {
      _id: skill._id,
      title: skill.title,
      createdBy: skill.createdBy,
      createdById: {
        _id: skill.createdById,
        email: creatorEmail,
      },
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
    };
  }
}
