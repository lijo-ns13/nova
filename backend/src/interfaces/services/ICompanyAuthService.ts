import {
  SignInCompanyRequestDTO,
  SignInCompanyResponseDTO,
} from "../../core/dtos/company/company.signin.dto";
import { SignUpCompanyRequestDTO } from "../../core/dtos/company/company.signup.dto";
import {
  CompanyResponseDTO,
  ForgetPasswordResponseDTO,
  ResendOtpResponseDTO,
  ResetPasswordInputDTO,
} from "../../mapping/company/auth/company.auth.mapper";
import { TempCompanyResponseDTO } from "../../mapping/company/auth/TempCompany.mapper";

export interface ICompanyAuthService {
  signUp(payload: SignUpCompanyRequestDTO): Promise<TempCompanyResponseDTO>;
  signIn(payload: SignInCompanyRequestDTO): Promise<SignInCompanyResponseDTO>;
  verifyOTP(email: string, otp: string): Promise<CompanyResponseDTO>;
  resendOTP(email: string): Promise<ResendOtpResponseDTO>;
  forgetPassword(email: string): Promise<ForgetPasswordResponseDTO>;
  resetPassword(data: ResetPasswordInputDTO): Promise<void>;
}
