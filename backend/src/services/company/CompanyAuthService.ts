import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ICompanyRepository } from "../../interfaces/repositories/ICompanyRepository";
import { ITempCompanyRepository } from "../../interfaces/repositories/ITempCompanyRepository";
import { ICompanyAuthService } from "../../interfaces/services/ICompanyAuthService";
import { IOTPRepository } from "../../interfaces/repositories/IOTPRepository";
import { SignUpCompanyRequestDTO } from "../../core/dtos/company/company.signup.dto";
import {
  SignInCompanyRequestDTO,
  SignInCompanyResponseDTO,
} from "../../core/dtos/company/company.signin.dto";
import bcrypt from "bcryptjs";
import { generateOTP } from "../../shared/util/otp.util";
import { sendOTPEmail } from "../../shared/util/email.util";
import { IEmailService } from "../../interfaces/services/IEmailService";
import { IJWTService } from "../../interfaces/services/IJwtService";
import { generateUsername } from "../../shared/util/GenerateUserName";
import { IPasswordResetTokenRepository } from "../../interfaces/repositories/IPasswordResetTokenRepository";
import { generatePasswordResetToken } from "../../shared/util/generatePasswordResetToken ";
import crypto from "crypto";
import { INotificationService } from "../../interfaces/services/INotificationService";

import { IAdminRepository } from "../../interfaces/repositories/IAdminRepository";
import {
  TempCompanyMapper,
  TempCompanyResponseDTO,
} from "../../mapping/company/auth/TempCompany.mapper";
import { SignInCompanyMapper } from "../../mapping/company/auth/SignInCompanyMapper";
import {
  CompanyAuthMapper,
  CompanyResponseDTO,
  ForgetPasswordResponseDTO,
  ResendOtpResponseDTO,
  ResetPasswordInputDTO,
} from "../../mapping/company/auth/company.auth.mapper";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
import { NotificationType } from "../../constants/notification.type.constant";

@injectable()
export class CompanyAuthService implements ICompanyAuthService {
  constructor(
    @inject(TYPES.CompanyRepository)
    private readonly _companyRepository: ICompanyRepository,
    @inject(TYPES.TempCompanyRepository)
    private readonly _tempCompanyRepository: ITempCompanyRepository,
    @inject(TYPES.OTPRepository)
    private readonly _otpRepository: IOTPRepository,
    @inject(TYPES.EmailService) private readonly _emailService: IEmailService,
    @inject(TYPES.JWTService)
    private readonly _jwtService: IJWTService,
    @inject(TYPES.PasswordResetTokenRepository)
    private readonly _passwordResetTokenRepository: IPasswordResetTokenRepository,
    @inject(TYPES.NotificationService)
    private readonly notificationService: INotificationService,
    @inject(TYPES.AdminRepository)
    private readonly _adminRepo: IAdminRepository,
    @inject(TYPES.MediaService) private readonly _mediaService: IMediaService
  ) {}

  async signUp(
    payload: SignUpCompanyRequestDTO,
    documents: Express.Multer.File[]
  ): Promise<TempCompanyResponseDTO> {
    const existing = await this._companyRepository.findByEmail(payload.email);
    if (existing) throw new Error("Email already exists");

    const existingTemp = await this._tempCompanyRepository.findByEmail(
      payload.email
    );
    if (existingTemp) throw new Error("Too many tries. Try again later.");

    const s3Keys = await Promise.all(
      documents.map((file) => this._mediaService.uploadSingleMedia(file))
    );

    const createdTemp = await this._tempCompanyRepository.create({
      ...payload,
      documents: s3Keys,
    });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 60 * 1000);
    await this._otpRepository.createOTP({
      accountId: createdTemp._id,
      accountType: "company",
      otp,
      expiresAt,
    });

    await sendOTPEmail(createdTemp.email, otp);

    return TempCompanyMapper.toDTO(createdTemp);
  }
  async signIn(
    payload: SignInCompanyRequestDTO
  ): Promise<SignInCompanyResponseDTO> {
    const company = await this._companyRepository.findByEmail(payload.email);
    if (!company) throw new Error("Company not found");

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      company.password
    );
    if (!isPasswordValid) throw new Error("Invalid password");

    const accessToken = this._jwtService.generateAccessToken("company", {
      id: company._id.toString(),
      email: company.email,
      role: "company",
    });

    const refreshToken = this._jwtService.generateRefreshToken("company", {
      id: company._id.toString(),
      email: company.email,
      role: "company",
    });

    const admins = await this._adminRepo.findAll();
    for (const admin of admins) {
      await this.notificationService.sendNotification(
        admin._id.toString(),
        `Company ${company.companyName} signed in`,
        NotificationType.GENERAL,
        company._id.toString()
      );
    }

    return SignInCompanyMapper.toDTO(company, accessToken, refreshToken);
  }

  async verifyOTP(email: string, otp: string): Promise<CompanyResponseDTO> {
    const tempCompany = await this._tempCompanyRepository.findByEmail(email);
    if (!tempCompany) throw new Error("Invalid company account");

    const otpRecord = await this._otpRepository.findOTPByAccount(
      tempCompany._id,
      "company"
    );
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      throw new Error("OTP expired or invalid");
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) throw new Error("Invalid OTP");

    let username = generateUsername(tempCompany.companyName);
    while (await this._companyRepository.isUsernameTaken(username)) {
      username = generateUsername(tempCompany.companyName);
    }

    const createdCompany = await this._companyRepository.create({
      companyName: tempCompany.companyName,
      email: tempCompany.email,
      password: tempCompany.password,
      about: tempCompany.about,
      industryType: tempCompany.industryType,
      foundedYear: tempCompany.foundedYear,
      documents: tempCompany.documents,
      location: tempCompany.location,
      username,
    });

    await this._tempCompanyRepository.delete(tempCompany._id.toString());

    const admins = await this._adminRepo.findAll();
    for (const admin of admins) {
      await this.notificationService.sendNotification(
        admin._id.toString(),
        `New company registered: ${createdCompany.companyName}`,
        NotificationType.GENERAL,
        createdCompany._id.toString()
      );
    }

    return CompanyAuthMapper.toDTO(createdCompany);
  }
  async resendOTP(email: string): Promise<ResendOtpResponseDTO> {
    const tempCompany = await this._tempCompanyRepository.findByEmail(email);
    if (!tempCompany) {
      throw new Error("Account not found or already verified");
    }

    const otpRecord = await this._otpRepository.findOTPByAccount(
      tempCompany._id,
      "company"
    );

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes
    const hashedOtp = await bcrypt.hash(otp, 10);

    if (otpRecord) {
      await this._otpRepository.updateOTP(otpRecord._id, {
        otp: hashedOtp,
        expiresAt,
      });
    } else {
      await this._otpRepository.createOTP({
        accountId: tempCompany._id,
        accountType: "company",
        otp: hashedOtp,
        expiresAt,
      });
    }

    await this._emailService.sendOTP(tempCompany.email, otp); // inject it, not static util

    return { message: "OTP resent successfully. Please check your email." };
  }

  async forgetPassword(email: string): Promise<ForgetPasswordResponseDTO> {
    const company = await this._companyRepository.findByEmail(email);
    if (!company) throw new Error("Company not found");

    await this._passwordResetTokenRepository.deleteByAccount(
      company._id,
      "company"
    );

    const { rawToken, hashedToken, expiresAt } = generatePasswordResetToken();

    await this._passwordResetTokenRepository.createToken({
      token: hashedToken,
      accountId: company._id,
      accountType: "company",
      expiresAt,
    });

    await this._emailService.sendPasswordResetCompanyEmail(
      company.email,
      rawToken
    );

    return { rawToken };
  }

  async resetPassword(data: ResetPasswordInputDTO): Promise<void> {
    const { token, password } = data;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const tokenDoc = await this._passwordResetTokenRepository.findByToken(
      hashedToken
    );
    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      throw new Error("Token is invalid or has expired");
    }

    if (tokenDoc.accountType !== "company") {
      throw new Error("Invalid account type for this operation");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this._companyRepository.updatePassword(
      tokenDoc.accountId.toString(),
      hashedPassword
    );

    await this._passwordResetTokenRepository.deleteByAccount(
      tokenDoc.accountId,
      tokenDoc.accountType
    );
  }
}
