// src/core/interfaces/repositories/IPasswordResetTokenRepository.ts
import { IBaseRepository } from "./IBaseRepository";
import { IPasswordResetToken } from "../../../infrastructure/database/models/PasswordResetToken";
import { Types } from "mongoose";
export interface CreatePasswordResetTokenDto {
  token: string;
  accountId: Types.ObjectId;
  accountType: "user" | "company";
  expiresAt: Date;
}

export interface IPasswordResetTokenRepository
  extends IBaseRepository<IPasswordResetToken> {
  createToken(arg0: {
    token: string;
    accountId: Types.ObjectId;
    accountType: string;
    expiresAt: Date;
  }): unknown;
  findByToken(token: string): Promise<IPasswordResetToken | null>;
  findByAccount(
    accountId: Types.ObjectId,
    accountType: "user" | "company"
  ): Promise<IPasswordResetToken | null>;
  deleteByToken(token: string): Promise<boolean>;
  deleteByAccount(
    accountId: Types.ObjectId,
    accountType: "user" | "company"
  ): Promise<boolean>;
}
