import { Container } from "inversify";
import { TYPES } from "./types";

import userModal from "../infrastructure/database/models/user.modal";

import { IUserRepository } from "../core/interfaces/repositories/IUserRepository";
import { ITempUserRepository } from "../core/interfaces/repositories/ITempUserRepository";

import { TempUserRepository } from "../infrastructure/database/repositories/mongo/TempUserRepository";
import { UserRepository } from "../infrastructure/database/repositories/mongo/UserRepository";
import { ITempCompanyRepository } from "../core/interfaces/repositories/ITempCompanyRepository";
import { TempCompanyRepository } from "../infrastructure/database/repositories/mongo/TempCompanyRepository";
import { ICompanyRepository } from "../core/interfaces/repositories/ICompanyRepository";
import { CompanyRepository } from "../infrastructure/database/repositories/mongo/CompanyRepository";
import { IOTPRepository } from "../core/interfaces/repositories/IOTPRepository";
import { IPasswordResetTokenRepository } from "../core/interfaces/repositories/IPasswordResetTokenRepository";
import { OTPRepository } from "../infrastructure/database/repositories/mongo/OTPRepository";
import { PasswordResetTokenRepository } from "../infrastructure/database/repositories/mongo/PasswordResetTokenRepository";
import { IUserAuthService } from "../core/interfaces/services/IUserAuthService";
import { IEmailService } from "../core/interfaces/services/IEmailService";
import { EmailService } from "../infrastructure/services/user/Email.Service";
import { UserAuthService } from "../infrastructure/services/user/UserAuthService";
import { AuthMiddleware } from "../presentation/http/middlewares/auth.middleware";
import { JWTService } from "../shared/util/jwt.service";
import { AuthController } from "../presentation/http/controllers/user/AuthController";
import { IAuthController } from "../core/interfaces/controllers/IUserAuthService";
import { IUser } from "../infrastructure/database/models/user.modal";
import { Model } from "mongoose";
import otpModal, { IOTP } from "../infrastructure/database/models/otp.modal";
import userTempModal, {
  ITempUser,
} from "../infrastructure/database/models/user.temp.modal";
import PasswordResetToken, {
  IPasswordResetToken,
} from "../infrastructure/database/models/PasswordResetToken";

const container = new Container();

// Repositories
container.bind<Model<IUser>>(TYPES.UserModal).toConstantValue(userModal);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

container.bind<Model<IOTP>>(TYPES.OTPModal).toConstantValue(otpModal);
container.bind<IOTPRepository>(TYPES.OTPRepository).to(OTPRepository);
container
  .bind<Model<ITempUser>>(TYPES.TempUserModal)
  .toConstantValue(userTempModal);
container
  .bind<ITempUserRepository>(TYPES.TempUserRepository)
  .to(TempUserRepository);

container
  .bind<ICompanyRepository>(TYPES.CompanyRepository)
  .to(CompanyRepository);
container
  .bind<ITempCompanyRepository>(TYPES.TempCompanyRepository)
  .to(TempCompanyRepository);

container
  .bind<Model<IPasswordResetToken>>(TYPES.PasswordResetTokenModal)
  .toConstantValue(PasswordResetToken);

container
  .bind<IPasswordResetTokenRepository>(TYPES.PasswordResetTokenRepository)
  .to(PasswordResetTokenRepository);

// services
container.bind<IUserAuthService>(TYPES.UserAuthService).to(UserAuthService);
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);
container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);
container.bind<JWTService>(TYPES.JWTService).to(JWTService);

// controller

container.bind<IAuthController>(TYPES.AuthController).to(AuthController);
export default container;
