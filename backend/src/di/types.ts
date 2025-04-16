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
  AdminModal: Symbol.for("AdminModal"),
  AdminRepository: Symbol.for("AdminRepository"),

  JobRepository: Symbol.for("JobRepository"),
  // services
  UserAuthService: Symbol.for("UserAuthService"),
  EmailService: Symbol.for("EmailService"),
  AuthMiddleware: Symbol.for("AuthMiddleware"),
  JWTService: Symbol.for("JWTService"),
  UserJobService: Symbol.for("UserJobService"),
  // company
  CompanyAuthService: Symbol.for("CompanyAuthService"),
  CompanyJobService: Symbol.for("CompanyJobService"),
  // company
  AdminAuthService: Symbol.for("AdminAuthService"),
  // controller
  // user
  AuthController: Symbol.for("AuthController"),
  UserJobController: Symbol.for("UserJobController"),
  // company
  CompanyAuthController: Symbol.for("CompanyAuthController"),
  CompanyJobController: Symbol.for("CompanyJobController"),
  // admin
  AdminAuthController: Symbol.for("AdminAuthController"),
};
