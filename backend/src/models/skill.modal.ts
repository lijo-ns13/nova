import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISkill extends Document {
  _id: Types.ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISkill>("Skill", SkillSchema);
