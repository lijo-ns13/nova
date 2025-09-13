
import { inject, injectable } from "inversify";
import { Model, Types } from "mongoose";
import { BaseRepository } from "./BaseRepository";
import {
  createOtpDTO,
  IOTPRepository,
} from "../../interfaces/repositories/IOTPRepository";
import { TYPES } from "../../di/types";
import { IOTP } from "../entities/otp.entity";

@injectable()
export class OTPRepository
  extends BaseRepository<IOTP>
  implements IOTPRepository
{
  constructor(@inject(TYPES.OTPModel) otpModel: Model<IOTP>) {
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
