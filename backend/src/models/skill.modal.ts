import mongoose, { Schema } from "mongoose";
import { ISkill } from "../repositories/entities/skill.entity";

const SkillSchema = new Schema<ISkill>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    createdById: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    createdBy: {
      type: String,
      enum: ["company", "admin", "user"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISkill>("Skill", SkillSchema);
