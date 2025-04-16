export const TYPES = {
  // Repositories
  UserModal: Symbol.for("UserModal"),
  UserRepository: Symbol.for("UserRepository"),

  TempUserModal: Symbol.for("TempUserModal"),
  TempUserRepository: Symbol.for("TempUserRepository"),
  PasswordResetTokenModal: Symbol.for("PasswordResetTokenModal"),
  PasswordResetTokenRepository: Symbol.for("PasswordResetTokenRepository"),
  OTPModal: Symbol.for("OTPModal"),
  OTPRepository: Symbol.for("OTPRepository"),
  CompanyModal: Symbol.for("CompanyModal"),
  CompanyRepository: Symbol.for("CompanyRepository"),
  TempCompanyModal: Symbol.for("TempCompanyModal"),
  TempCompanyRepository: Symbol.for("TempCompanyRepository"),
  AdminAuthRepository: Symbol.for("AdminAuthRepository"),

  // services
  UserAuthService: Symbol.for("UserAuthService"),
  EmailService: Symbol.for("EmailService"),
  AuthMiddleware: Symbol.for("AuthMiddleware"),
  JWTService: Symbol.for("JWTService"),
  // company
  CompanyAuthService: Symbol.for("CompanyAuthService"),

  // controller
  // user
  AuthController: Symbol.for("AuthController"),
  // company
  CompanyAuthController: Symbol.for("CompanyAuthController"),
};
