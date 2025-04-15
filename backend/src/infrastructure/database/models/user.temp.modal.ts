import bcrypt from "bcrypt";
import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITempUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  expiresAt: Date;
}

const TempUserSchema = new Schema<ITempUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000),
  },
});
TempUserSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const saltRounds = 10; // recommended
    user.password = await bcrypt.hash(user.password, saltRounds);
    next();
  } catch (err) {
    next(err as Error);
  }
});
TempUserSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<ITempUser>("TempUser", TempUserSchema);
