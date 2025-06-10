// src/interfaces/repositories/IOTPRepository.ts
import { Types } from "mongoose";
import { IOTP } from "../../models/otp.modal";
import { IBaseRepository } from "./IBaseRepository";

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
