import {
  SignInCompanyRequestDTO,
  SignInCompanyResponseDTO,
} from "../../core/dtos/company/company.signin.dto";
import { SignUpCompanyRequestDTO } from "../../core/dtos/company/company.signup.dto";

export interface ICompanyAuthService {
  signUp(payload: SignUpCompanyRequestDTO): Promise<any>;

  signIn(payload: SignInCompanyRequestDTO): Promise<SignInCompanyResponseDTO>;

  verifyOTP(
    email: string,
    otp: string
  ): Promise<{ message: string; company: object }>;

  resendOTP(email: string): Promise<{ message: string }>;
}
