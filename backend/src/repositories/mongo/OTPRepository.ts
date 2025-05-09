// src/infrastructure/database/repositories/mongo/OTPRepository.ts
import { inject, injectable } from "inversify";
import { Model, Types } from "mongoose";
import {
  createOtpDTO,
  IOTPRepository,
} from "../../interfaces/repositories/IOTPRepository";
import otpModal, { IOTP } from "../../models/otp.modal";
import { BaseRepository } from "./BaseRepository";
import { TYPES } from "../../di/types";

@injectable()
export class OTPRepository
  extends BaseRepository<IOTP>
  implements IOTPRepository
{
  constructor(@inject(TYPES.OTPModal) otpModal: Model<IOTP>) {
    super(otpModal);
  }

  async createOTP(data: createOtpDTO): Promise<IOTP> {
    const otpDoc = new otpModal(data);
    return await otpDoc.save();
  }

  async findOTPByAccount(
    accountId: Types.ObjectId,
    accountType: "user" | "company"
  ): Promise<IOTP | null> {
    return await otpModal.findOne({ accountId, accountType });
  }

  async updateOTP(
    otpId: Types.ObjectId,
    updateData: Partial<createOtpDTO>
  ): Promise<IOTP | null> {
    return await otpModal.findByIdAndUpdate(otpId, updateData, { new: true });
  }
}
