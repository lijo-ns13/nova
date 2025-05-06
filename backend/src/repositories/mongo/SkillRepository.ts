import { ISkillRepository } from "../../core/interfaces/repositories/ISkillRepository";
import skillModal, { ISkill } from "../../models/skill.modal";

export class SkillRepository implements ISkillRepository {
  async create(skill: string): Promise<ISkill> {
    const newSkill = new skillModal({
      title: skill.toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await newSkill.save();
  }

  async update(id: string, updates: Partial<ISkill>): Promise<ISkill | null> {
    return await skillModal.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await skillModal.findByIdAndDelete(id);
    return !!result;
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

  async getById(id: string): Promise<ISkill | null> {
    return await skillModal.findById(id);
  }
  async getByTitle(title: string): Promise<ISkill | null> {
    return await skillModal.findOne({ title: title });
  }
  async searchSkills(query: string, limit = 10): Promise<string[]> {
    const regex = new RegExp(`^${query}`, "i"); // ^ anchors to start of string
    const skills = await skillModal.find({ title: regex }).limit(limit);
    return skills.map((s) => s.title);
  }
}
