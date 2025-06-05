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
import bcrypt from "bcrypt";
import { generateOTP } from "../../shared/util/otp.util";
import { sendOTPEmail } from "../../shared/util/email.util";
import { JWTService } from "../../shared/util/jwt.service";
import { IEmailService } from "../../interfaces/services/IEmailService";
import { IJWTService } from "../../interfaces/services/IJwtService";
import { generateUsername } from "../../shared/util/GenerateUserName";
import { IPasswordResetTokenRepository } from "../../interfaces/repositories/IPasswordResetTokenRepository";
import { generatePasswordResetToken } from "../../shared/util/generatePasswordResetToken ";
import crypto from "crypto";
import { INotificationService } from "../../interfaces/services/INotificationService";
import { NotificationType } from "../../models/notification.modal";
import { IAdminRepository } from "../../interfaces/repositories/IAdminRepository";

@injectable()
export class CompanyAuthService implements ICompanyAuthService {
  constructor(
    @inject(TYPES.CompanyRepository)
    private _companyRepository: ICompanyRepository,
    @inject(TYPES.TempCompanyRepository)
    private _tempCompanyRepository: ITempCompanyRepository,
    @inject(TYPES.OTPRepository) private _otpRepository: IOTPRepository,
    @inject(TYPES.EmailService) private _emailService: IEmailService,
    @inject(TYPES.JWTService)
    private _jwtService: IJWTService,
    @inject(TYPES.PasswordResetTokenRepository)
    private _passwordResetTokenRepository: IPasswordResetTokenRepository,
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService,
    @inject(TYPES.AdminRepository) private _adminRepo: IAdminRepository
  ) {}

  async signUp(payload: SignUpCompanyRequestDTO): Promise<any> {
    const existingCompany = await this._companyRepository.findByEmail(
      payload.email
    );
    const existingTempCompany = await this._tempCompanyRepository.findByEmail(
      payload.email
    );
    if (existingCompany) {
      throw new Error("Email already exists");
    }
    if (existingTempCompany) {
      throw new Error("Too many tries ,try later");
    }
    const tempCompany = await this._tempCompanyRepository.create(payload);
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
    await this._otpRepository.createOTP({
      accountId: tempCompany._id,
      accountType: "company",
      otp: otp,
      expiresAt: expiresAt,
    });
    await sendOTPEmail(tempCompany.email, otp);
    return { tempCompany };
  }
  async signIn(
    payload: SignInCompanyRequestDTO
  ): Promise<SignInCompanyResponseDTO> {
    const company = await this._companyRepository.findByEmail(payload.email);
    if (!company) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(
      payload.password,
      company.password
    );
    if (!isPasswordValid) {
      throw new Error("Enter invalid password");
    }
    const companyAccessToken = this._jwtService.generateAccessToken("company", {
      id: company._id.toString(),
      email: company.email,
      role: "company",
    });
    const companyRefreshToken = this._jwtService.generateRefreshToken(
      "company",
      {
        id: company._id.toString(),
        email: company.email,
        role: "company",
      }
    );
    const admins = await this._adminRepo.findAll();
    for (const admin of admins) {
      await this.notificationService.sendNotification(
        admin._id.toString(),
        `company ${company.companyName} signin succussflly`,
        NotificationType.GENERAL,
        company._id // senderId
      );
    }
    return {
      accessToken: companyAccessToken,
      refreshToken: companyRefreshToken,
      company: company,
      isVerified: company.isVerified,
      isBlocked: company.isBlocked,
    };
  }
  async verifyOTP(
    email: string,
    otp: string
  ): Promise<{ message: string; company: object }> {
    const tempCompany = await this._tempCompanyRepository.findByEmail(email);
    if (!tempCompany) {
      throw new Error("Invalid Company account");
    }
    const otpRecord = await this._otpRepository.findOTPByAccount(
      tempCompany?._id,
      "company"
    );
    if (!otpRecord) {
      throw new Error("Invalid otp enter correct otp");
    }
    if (otpRecord.expiresAt < new Date()) {
      throw new Error("OTP expired");
    }
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);

    if (!isMatch) {
      throw new Error("Invalid OTP");
    }
    let username = generateUsername(tempCompany.companyName);
    while (await this._companyRepository.isUsernameTaken(username)) {
      username = `${generateUsername(tempCompany.companyName)}`;
    }
    const tempCompanyData = {
      companyName: tempCompany.companyName,
      password: tempCompany.password,
      about: tempCompany.about,
      email: tempCompany.email,
      industryType: tempCompany.industryType,
      foundedYear: tempCompany.foundedYear,
      documents: tempCompany.documents,
      location: tempCompany.location,
      username: username,
    };

    const companyData = await this._companyRepository.create(tempCompanyData);
    await this._tempCompanyRepository.delete(tempCompany._id.toString());
    const admins = await this._adminRepo.findAll();
    for (const admin of admins) {
      await this.notificationService.sendNotification(
        admin._id.toString(),
        `New company registered: ${companyData.companyName}`,
        NotificationType.GENERAL,
        companyData._id // senderId
      );
    }

    return { message: "verfied successfull", company: companyData };
  }
  async resendOTP(email: string): Promise<{ message: string }> {
    const tempCompany = await this._tempCompanyRepository.findByEmail(email);
    if (!tempCompany) throw new Error("User not found or already verified");
    const otpRecord = await this._otpRepository.findOTPByAccount(
      tempCompany._id,
      "company"
    );

    // 3. Rate-limit: if OTP exists and was generated recently, deny resend
    // if (otpRecord) {
    //   const timeSinceLastOTP = Date.now() - otpRecord.updatedAt.getTime();
    //   const resendCooldown = 60 * 1000; // 1 min cooldown
    //   if (timeSinceLastOTP < resendCooldown) {
    //     const waitTimeInSeconds = Math.ceil((resendCooldown - timeSinceLastOTP) / 1000);
    //     throw new Error(`Please wait ${waitTimeInSeconds} seconds before resending OTP.`);
    //   }
    // }

    // 4. Generate new OTP
    const newOTP = generateOTP();
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 3 mins expiry

    // 5. Hash the OTP before saving it (security best practice)
    const hashedOTP = await bcrypt.hash(newOTP, 10);

    if (otpRecord) {
      // 6. Update the existing OTP record with new OTP and expiry
      await this._otpRepository.updateOTP(otpRecord._id, {
        otp: hashedOTP,
        expiresAt: expiresAt,
      });
    } else {
      // Or create a new one if no existing record
      await this._otpRepository.createOTP({
        accountId: tempCompany._id,
        accountType: "company",
        otp: hashedOTP,
        expiresAt: expiresAt,
      });
    }

    // 7. Send the new OTP via email
    await sendOTPEmail(tempCompany.email, newOTP);

    return { message: "OTP resent successfully. Please check your email." };
  }
  // forget
  async forgetPassword(email: string): Promise<{ rawToken: string }> {
    const user = await this._companyRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const userId = user._id;

    await this._passwordResetTokenRepository.deleteByAccount(userId, "company");

    const { rawToken, hashedToken, expiresAt } = generatePasswordResetToken();

    await this._passwordResetTokenRepository.createToken({
      token: hashedToken,
      accountId: userId,
      accountType: "company",
      expiresAt,
    });

    await this._emailService.sendPasswordResetCompanyEmail(
      user.email,
      rawToken
    );

    return { rawToken };
  }

  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    if (password !== confirmPassword) throw new Error("Passwords do not match");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const tokenDoc = await this._passwordResetTokenRepository.findByToken(
      hashedToken
    );
    if (!tokenDoc || tokenDoc.expiresAt < new Date())
      throw new Error("Token is invalid or has expired");

    const { accountId, accountType } = tokenDoc;
    if (accountType !== "company")
      throw new Error("Invalid account type for this operation");

    const hashedPassword = await bcrypt.hash(password, 10);
    await this._companyRepository.updatePassword(
      accountId.toString(),
      hashedPassword
    );

    await this._passwordResetTokenRepository.deleteByAccount(
      accountId,
      accountType
    );
  }
}
