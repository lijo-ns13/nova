import {
  SignupRequestDTO,
  SigninRequestDTO,
} from "../../dtos/request/user.request.dto";
import {
  SignUpResponseDTO,
  SignInResponseDTO,
} from "../../dtos/response/user.response.dto";

export interface IUserAuthService {
  signUp(payload: SignupRequestDTO): Promise<SignUpResponseDTO>;
  signIn(payload: SigninRequestDTO): Promise<SignInResponseDTO>;
  verifyOTP(email: string, otp: string): Promise<{ message: string }>;
  resendOTP(email: string): Promise<{ message: string }>;
  forgetPassword(email: string): Promise<{ rawToken: string }>;
  resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<void>;
}
