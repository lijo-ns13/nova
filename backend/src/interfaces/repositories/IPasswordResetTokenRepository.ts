import { IPasswordResetToken } from "../../repositories/entities/password.reset.entity";
import { IBaseRepository } from "./IBaseRepository";

import { Types } from "mongoose";

export interface CreatePasswordResetTokenDto {
  token: string;
  accountId: Types.ObjectId;
  accountType: "user" | "company";
  expiresAt: Date;
}

export interface IPasswordResetTokenRepository
  extends IBaseRepository<IPasswordResetToken> {
  createToken(data: CreatePasswordResetTokenDto): Promise<IPasswordResetToken>;
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
