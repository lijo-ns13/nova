export interface VerifyEntity {
  email: string;
  otp: string;
}
export interface resendEntity {
  email: string;
}
export interface forgetEntity {
  email: string;
}
export interface resetEntity {
  token: string;
  password: string;
  confirmPassword: string;
}
