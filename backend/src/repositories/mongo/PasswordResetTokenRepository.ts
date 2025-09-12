import { inject, injectable } from "inversify";
import { Model, Types } from "mongoose";

import { BaseRepository } from "./BaseRepository";
import { TYPES } from "../../di/types";
import {
  CreatePasswordResetTokenDto,
  IPasswordResetTokenRepository,
} from "../../interfaces/repositories/IPasswordResetTokenRepository";
import { IPasswordResetToken } from "../entities/password.reset.entity";

@injectable()
export class PasswordResetTokenRepository
  extends BaseRepository<IPasswordResetToken>
  implements IPasswordResetTokenRepository
{
  constructor(
    @inject(TYPES.PasswordResetTokenModel)
    model: Model<IPasswordResetToken>
  ) {
    super(model);
  }

  async createToken(
    data: CreatePasswordResetTokenDto
  ): Promise<IPasswordResetToken> {
    return this.create(data);
  }

  async findByToken(token: string): Promise<IPasswordResetToken | null> {
    return this.findOne({ token });
  }

  async findByAccount(
    accountId: Types.ObjectId,
    accountType: "user" | "company"
  ): Promise<IPasswordResetToken | null> {
    return this.findOne({ accountId, accountType });
  }

  async deleteByToken(token: string): Promise<boolean> {
    const doc = await this.findOne({ token });
    if (!doc) return false;
    return this.delete(doc._id.toString());
  }

  async deleteByAccount(
    accountId: Types.ObjectId,
    accountType: "user" | "company"
  ): Promise<boolean> {
    const doc = await this.findOne({ accountId, accountType });
    if (!doc) return false;
    return this.delete(doc._id.toString());
  }
}
