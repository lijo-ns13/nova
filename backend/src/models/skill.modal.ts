import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISkill extends Document {
  _id: Types.ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  createdById?: Types.ObjectId;
  createdBy?: "user" | "company" | "admin";
}

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
