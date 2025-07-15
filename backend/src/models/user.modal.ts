// usermodel
import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  password?: string;
  profilePicture?: string;
  skills: string[] | [];
  certifications: mongoose.Types.ObjectId[] | [];
  experiences: mongoose.Types.ObjectId[] | [];
  educations: mongoose.Types.ObjectId[] | [];
  projects: mongoose.Types.ObjectId[] | [];
  followers: mongoose.Types.ObjectId[] | [];
  following: mongoose.Types.ObjectId[] | [];
  // connections: mongoose.Types.ObjectId[] | [];
  headline?: string;
  about?: string;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  googleId?: string;
  isVerified: boolean;
  appliedJobs: mongoose.Types.ObjectId[] | [];
  savedJobs: mongoose.Types.ObjectId[] | [];
  socketId?: string;
  online?: boolean;
  // Subscription
  isSubscriptionActive: boolean;
  subscriptionStartDate: Date | null;
  subscriptionEndDate: Date | null;
  subscriptionCancelled: boolean;
  subscription?: Types.ObjectId | null;
  activePaymentSession?: string | null;
  activePaymentSessionExpiresAt?: Date | null;
  // job,post count
  appliedJobCount: number;
  createdPostCount: number;
}

const userSchema = new Schema<IUser>(
  {
    googleId: { type: String, unique: true, sparse: true },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],

    certifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Certificate",
      },
    ],
    experiences: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Experience",
      },
    ],
    educations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Education",
      },
    ],
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    // connections: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //   },
    // ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    headline: {
      type: String,
      trim: true,
      default: "",
    },
    about: {
      type: String,
      trim: true,
      default: "",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    // socket
    socketId: {
      type: String,
      default: null,
    },
    online: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
    isSubscriptionActive: {
      type: Boolean,
      default: false,
      index: true, // Optimizes subscription checks
    },
    subscriptionStartDate: {
      type: Date,
      default: null,
    },
    subscriptionEndDate: {
      type: Date,
      default: null,
    },
    subscriptionCancelled: {
      type: Boolean,
      default: false,
    },
    activePaymentSession: {
      type: String,
      default: null,
    },
    activePaymentSessionExpiresAt: {
      type: Date,
      default: null,
    },
    appliedJobCount: {
      type: Number,
      default: 0,
    },
    createdPostCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  const user = this;
  // ✅ If there is no password, skip hashing
  if (!user.password) {
    return next();
  }
  if (!user.isModified("password")) {
    return next();
  }

  try {
    const saltRounds = 10; // recommended
    // ✅ Skip if already hashed (check password length or bcrypt hash pattern)
    if (user.password && user.password.startsWith("$2b$")) {
      return next(); // already hashed, no need to rehash
    }
    user.password = await bcrypt.hash(user.password, saltRounds);
    next();
  } catch (err) {
    next(err as Error);
  }
});

export default mongoose.model<IUser>("User", userSchema);

// applied and saved jobs id i will poplulate that
