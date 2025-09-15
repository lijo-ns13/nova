import { Types } from "mongoose";

import { IBaseRepository } from "./IBaseRepository";
import { IOTP } from "../../repositories/entities/otp.entity";

export interface createOtpDTO {
  accountId: Types.ObjectId;
  accountType: "user" | "company";
  otp: string;
  expiresAt: Date;
}

export interface IOTPRepository extends IBaseRepository<IOTP> {
  createOTP(data: createOtpDTO): Promise<IOTP>;
  findOTPByAccount(
    accountId: Types.ObjectId,
    accountType: "user" | "company"
  ): Promise<IOTP | null>;
  updateOTP(
    otpId: Types.ObjectId,
    updateData: Partial<createOtpDTO>
  ): Promise<IOTP | null>;
}
