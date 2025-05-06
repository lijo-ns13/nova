// src/core/interfaces/repositories/IOTPRepository.ts
import { IBaseRepository } from "./IBaseRepository";
import { IOTP } from "../../../models/otp.modal";
import { Types } from "mongoose";
export interface createOtpDTO {
  accountId: Types.ObjectId; // The ID of the user or company
  accountType: "user" | "company"; // The type of account
  otp: string; // The OTP code
  expiresAt: Date; // The expiration date of the OTP
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
