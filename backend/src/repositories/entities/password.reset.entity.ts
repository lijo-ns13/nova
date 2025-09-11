import { Types } from "mongoose";

export interface IPasswordResetToken {
  findByToken(hashedToken: string): unknown;
  deleteByAccount(userId: Types.ObjectId, arg1: string): unknown;
  createToken(arg0: {
    token: string;
    accountId: Types.ObjectId;
    accountType: string;
    expiresAt: Date;
  }): unknown;
  _id: Types.ObjectId;
  token: string;
  accountId: Types.ObjectId;
  accountType: "user" | "company";
  expiresAt: Date;
}
