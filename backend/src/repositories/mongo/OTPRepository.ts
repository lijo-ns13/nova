// src/infrastructure/database/repositories/mongo/OTPRepository.ts
import { inject, injectable } from "inversify";
import { Model, Types } from "mongoose";
import { BaseRepository } from "./BaseRepository";
import { IOTP } from "../../models/otp.modal";
import {
  createOtpDTO,
  IOTPRepository,
} from "../../interfaces/repositories/IOTPRepository";
import { TYPES } from "../../di/types";

@injectable()
export class OTPRepository
  extends BaseRepository<IOTP>
  implements IOTPRepository
{
  constructor(@inject(TYPES.OTPModal) otpModel: Model<IOTP>) {
    super(otpModel);
  }

  async createOTP(data: createOtpDTO): Promise<IOTP> {
    return this.create(data);
  }

  async findOTPByAccount(
    accountId: Types.ObjectId,
    accountType: "user" | "company"
  ): Promise<IOTP | null> {
    return this.findOne({ accountId, accountType });
  }

  async updateOTP(
    otpId: Types.ObjectId,
    updateData: Partial<createOtpDTO>
  ): Promise<IOTP | null> {
    return this.update(otpId.toString(), updateData);
  }
}
