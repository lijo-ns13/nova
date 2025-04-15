// src/infrastructure/database/repositories/mongo/PasswordResetTokenRepository.ts
import { inject, injectable } from "inversify";
import { Model, Types } from "mongoose";
import {
  CreatePasswordResetTokenDto,
  IPasswordResetTokenRepository,
} from "../../../../core/interfaces/repositories/IPasswordResetTokenRepository";
import PasswordResetToken, {
  IPasswordResetToken,
} from "../../models/PasswordResetToken";
import { BaseRepository } from "./BaseRepository";
import { TYPES } from "../../../../di/types";

@injectable()
export class PasswordResetTokenRepository
  extends BaseRepository<IPasswordResetToken>
  implements IPasswordResetTokenRepository
{
  constructor(
    @inject(TYPES.PasswordResetTokenModal)
    model: Model<IPasswordResetToken>
  ) {
    super(model);
  }

  createToken(arg0: {
    token: string;
    accountId: Types.ObjectId;
    accountType: string;
    expiresAt: Date;
  }): unknown {
    throw new Error("Method not implemented.");
  }

  async findByToken(token: string): Promise<IPasswordResetToken | null> {
    return this.model.findOne({ token }).exec();
  }

  async findByAccount(
    accountId: Types.ObjectId,
    accountType: "user" | "company"
  ): Promise<IPasswordResetToken | null> {
    return this.model.findOne({ accountId, accountType }).exec();
  }

  async deleteByToken(token: string): Promise<boolean> {
    const result = await this.model.deleteOne({ token });
    return result.deletedCount === 1;
  }

  async deleteByAccount(
    accountId: Types.ObjectId,
    accountType: "user" | "company"
  ): Promise<boolean> {
    const result = await this.model.deleteMany({ accountId, accountType });
    return result.deletedCount > 0;
  }
}
