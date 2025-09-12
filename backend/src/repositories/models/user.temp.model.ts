import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { TempUserSchema } from "../schema/user.temp.schema";
import { ITempUser } from "../entities/tempuser.entity";

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
