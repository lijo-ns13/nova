import mongoose from "mongoose";
import { ISkill } from "../entities/skill.entity";
import { SkillSchema } from "../schema/skill.schema";

export default mongoose.model<ISkill>("Skill", SkillSchema);
