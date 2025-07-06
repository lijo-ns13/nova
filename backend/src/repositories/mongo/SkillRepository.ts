import { Model, Types } from "mongoose";
import { ISkillRepository } from "../../interfaces/repositories/ISkillRepository";
import skillModal, { ISkill } from "../../models/skill.modal";
import { BaseRepository } from "./BaseRepository";
import { TYPES } from "../../di/types";
import { inject } from "inversify";

export class SkillRepository
  extends BaseRepository<ISkill>
  implements ISkillRepository
{
  constructor(@inject(TYPES.skillModal) skillModal: Model<ISkill>) {
    super(skillModal);
  }
  async createSkillWith(
    title: string,
    createdById: string,
    createdBy: "user" | "company" | "admin"
  ): Promise<ISkill> {
    return this.model.create({
      title,
      createdById: new Types.ObjectId(createdById),
      createdBy,
    });
  }
  async getAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ skills: ISkill[]; total: number }> {
    const skip = (page - 1) * limit;

    let query = skillModal.find();
    console.log("query", query);

    if (search) {
      const regex = new RegExp(search, "i");
      query = query.where("title").regex(regex);
      console.log(query.where("title").regex(regex), "regex");
    }

    const [skills, total] = await Promise.all([
      query.skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      skillModal.countDocuments(query.getFilter()),
    ]);

    return { skills, total };
  }
  async getByTitle(title: string): Promise<ISkill | null> {
    return await skillModal.findOne({ title: title });
  }
  async searchSkills(query: string, limit = 10): Promise<ISkill[]> {
    const regex = new RegExp(`^${query}`, "i"); // ^ anchors to start of string
    const skills = await skillModal.find({ title: regex }).limit(limit);
    return skills;
  }
}
