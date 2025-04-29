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
import { EmailService } from "../application/services/user/Email.Service";
import { UserAuthService } from "../application/services/user/UserAuthService";
import { AuthMiddleware } from "../presentation/http/middlewares/auth.middleware";
import { JWTService } from "../shared/util/jwt.service";
import { AuthController } from "../presentation/http/controllers/user/AuthController";
import { IAuthController } from "../core/interfaces/controllers/IUserAuthController";
import { IUser } from "../infrastructure/database/models/user.modal";
import { Model } from "mongoose";
import otpModal, { IOTP } from "../infrastructure/database/models/otp.modal";
import userTempModal, {
  ITempUser,
} from "../infrastructure/database/models/user.temp.modal";
import PasswordResetToken, {
  IPasswordResetToken,
} from "../infrastructure/database/models/PasswordResetToken";
import { CompanyAuthController } from "../presentation/http/controllers/company/CompanyAuthController";
import { CompanyAuthService } from "../application/services/company/CompanyAuthService";
import { ICompanyAuthService } from "../core/interfaces/services/ICompanyAuthService";
import { ICompanyAuthController } from "../core/interfaces/controllers/ICompanyAuthController";
import companyModal, {
  ICompany,
} from "../infrastructure/database/models/company.modal";
import companyTempModal, {
  ITempCompany,
} from "../infrastructure/database/models/company.temp.modal";
import { Admin } from "../infrastructure/database/models/admin.modal";
import { AdminRepository } from "../infrastructure/database/repositories/mongo/AdminRepository";
import { IAdminRepository } from "../core/interfaces/repositories/IAdminRepository";
import { AdminAuthService } from "../application/services/admin/AdminAuthService";
import { IAdminAuthService } from "../core/interfaces/services/IAdminAuthService";
import { AdminAuthController } from "../presentation/http/controllers/admin/AdminAuthController";
import { IAdminAuthController } from "../core/interfaces/controllers/IAdminAuthController";
import { IJobRepository } from "../core/interfaces/repositories/IJobRepository";
import { JobRepository } from "../infrastructure/database/repositories/mongo/JobRepository";
import { IUserJobService } from "../core/interfaces/services/IUserJobService";
import { UserJobService } from "../application/services/user/UserJobService";
import { IUserJobController } from "../core/interfaces/controllers/IUserJobController";
import { UserJobController } from "../presentation/http/controllers/user/UserJobController";
import { IAuthMiddleware } from "../core/interfaces/middlewares/IAuthMiddleware";
import { IJWTService } from "../core/interfaces/services/IJwtService";
import { ICompanyJobService } from "../core/interfaces/services/ICompanyJobService";
import { CompanyJobService } from "../application/services/company/CompanyJobService";
import { CompanyJobController } from "../presentation/http/controllers/company/CompanyJobController";
import { ICompanyJobController } from "../core/interfaces/controllers/ICompanyJobController";
import { IAdminUserManagementService } from "../core/interfaces/services/IAdminUserManagementService";
import { AdminUserManagementService } from "../application/services/admin/AdminUserManagementService";
import { IAdminUserManagementController } from "../core/interfaces/controllers/IAdminUserManagementController ";
import { AdminUserManagementController } from "../presentation/http/controllers/admin/AdminUserManagementController";
import { IAdminCompanyManagementController } from "../core/interfaces/controllers/IAdminCompanyManagementController";
import { AdminCompanyManagementController } from "../presentation/http/controllers/admin/AdminCompanyManagementController";
import { IAdminCompanyManagementService } from "../core/interfaces/services/IAdminCompanyManagementService ";
import { AdminCompanyManagementService } from "../application/services/admin/AdminCompanyManagementService";
import { ISkillRepository } from "../core/interfaces/repositories/ISkillRepository";
import { SkillRepository } from "../infrastructure/database/repositories/mongo/SkillRepository";
import { AdminSkillController } from "../presentation/http/controllers/admin/AdminSkillController";
import { IAdminSkillService } from "../core/interfaces/services/IAdminSkillService";
import { AdminSkillService } from "../application/services/admin/AdminSkillService";
import { IAdminSkillController } from "../core/interfaces/controllers/IAdminSkillController";
import { UserProfileController } from "../presentation/http/controllers/user/UserProfileController";
import { IUserProfileService } from "../core/interfaces/services/IUserProfileService";
import { UserProfileService } from "../application/services/user/UserProfileService";
import { IUserProfileController } from "../core/interfaces/controllers/IUserProfileController";
import { SkillService } from "../application/services/SkillService";
import { ISkillService } from "../core/interfaces/services/ISkillService";
import { SkillController } from "../presentation/http/controllers/SkillController";
import { ISkillController } from "../core/interfaces/controllers/ISkillController";
import { IPostRepository } from "../core/interfaces/repositories/IPostRepository";
import { PostRepository } from "../infrastructure/database/repositories/mongo/PostRepository";
import { ICommentRepository } from "../core/interfaces/repositories/ICommentRepository";
import { CommentRepository } from "../infrastructure/database/repositories/mongo/CommentRepository";
import { ILikeRepository } from "../core/interfaces/repositories/ILikeRepository";
import { LikeRepository } from "../infrastructure/database/repositories/mongo/LikeRepository";
import { IMediaRepository } from "../core/interfaces/repositories/IMediaRepository";
import { MediaRepository } from "../infrastructure/database/repositories/mongo/MediaRepository";
import { IPostService } from "../core/interfaces/services/Post/IPostService";
import { PostService } from "../application/services/user/PostService";
import { IMediaService } from "../core/interfaces/services/Post/IMediaService";
import { Types } from "aws-sdk/clients/acm";
import { MediaService } from "../application/services/user/MediaService";
import { PostController } from "../presentation/http/controllers/user/PostController";
import { IPostController } from "../core/interfaces/controllers/post/IPostController";
import postModal, { IPost } from "../infrastructure/database/models/post.modal";
import { LikeService } from "../application/services/user/LikeService";
import { ILikeService } from "../core/interfaces/services/Post/ILikeService";
import likeModal, { ILike } from "../infrastructure/database/models/like.modal";
import { ICommentService } from "../core/interfaces/services/ICommentService";
import { CommentService } from "../application/services/user/CommentService";

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
  .bind<Model<ICompany>>(TYPES.CompanyModal)
  .toConstantValue(companyModal);
container
  .bind<ICompanyRepository>(TYPES.CompanyRepository)
  .to(CompanyRepository);
container
  .bind<Model<ITempCompany>>(TYPES.TempCompanyModal)
  .toConstantValue(companyTempModal);
container
  .bind<ITempCompanyRepository>(TYPES.TempCompanyRepository)
  .to(TempCompanyRepository);

container
  .bind<Model<IPasswordResetToken>>(TYPES.PasswordResetTokenModal)
  .toConstantValue(PasswordResetToken);

container
  .bind<IPasswordResetTokenRepository>(TYPES.PasswordResetTokenRepository)
  .to(PasswordResetTokenRepository);
container.bind<ISkillRepository>(TYPES.SkillRepository).to(SkillRepository);

// job
container.bind<IJobRepository>(TYPES.JobRepository).to(JobRepository);
container.bind<IUserJobService>(TYPES.UserJobService).to(UserJobService);
container
  .bind<IUserJobController>(TYPES.UserJobController)
  .to(UserJobController);
// post
container.bind<Model<IPost>>(TYPES.postModal).toConstantValue(postModal);
container.bind<IPostRepository>(TYPES.PostRepository).to(PostRepository);
container
  .bind<ICommentRepository>(TYPES.CommentRepository)
  .to(CommentRepository);
container.bind<Model<ILike>>(TYPES.likeModal).toConstantValue(likeModal);
container.bind<ILikeRepository>(TYPES.LikeRepository).to(LikeRepository);
container.bind<IMediaRepository>(TYPES.MediaRepository).to(MediaRepository);

// admin
container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository);
container.bind(TYPES.AdminModal).toConstantValue(Admin);

// services**************************

container.bind<IUserAuthService>(TYPES.UserAuthService).to(UserAuthService);
container.bind<IEmailService>(TYPES.EmailService).to(EmailService);
container.bind<IJWTService>(TYPES.JWTService).to(JWTService);
container
  .bind<IUserProfileService>(TYPES.UserProfileService)
  .to(UserProfileService);
// company
container
  .bind<ICompanyAuthService>(TYPES.CompanyAuthService)
  .to(CompanyAuthService);
container
  .bind<ICompanyJobService>(TYPES.CompanyJobService)
  .to(CompanyJobService);
// admin
container.bind<IAdminAuthService>(TYPES.AdminAuthService).to(AdminAuthService);
container
  .bind<IAdminUserManagementService>(TYPES.AdminUserManagementService)
  .to(AdminUserManagementService);
container
  .bind<IAdminCompanyManagementService>(TYPES.AdminCompanyManagementService)
  .to(AdminCompanyManagementService);
container
  .bind<IAdminSkillService>(TYPES.AdminSkillService)
  .to(AdminSkillService);
// post
container.bind<IPostService>(TYPES.PostService).to(PostService);
container.bind<ICommentService>(TYPES.CommentService).to(CommentService);
container.bind<ILikeService>(TYPES.LikeService).to(LikeService);
container.bind<IMediaService>(TYPES.MediaService).to(MediaService);

// controller*********************************************
// user
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);
container
  .bind<IUserProfileController>(TYPES.UserProfileController)
  .to(UserProfileController);
// post
container.bind<IPostController>(TYPES.PostController).to(PostController);
// container.bind<ICommentController>(TYPES.CommentController).to(CommentController);
// container.bind<ILikeController>(TYPES.LikeController).to(LikeController);
// container.bind<IMediaController>(TYPES.MediaController)>to(MediaController);

// company
container
  .bind<ICompanyAuthController>(TYPES.CompanyAuthController)
  .to(CompanyAuthController);
container
  .bind<ICompanyJobController>(TYPES.CompanyJobController)
  .to(CompanyJobController);
// admin
container
  .bind<IAdminAuthController>(TYPES.AdminAuthController)
  .to(AdminAuthController);
container
  .bind<IAdminUserManagementController>(TYPES.AdminUserManagementController)
  .to(AdminUserManagementController);
container
  .bind<IAdminCompanyManagementController>(
    TYPES.AdminCompanyManagementController
  )
  .to(AdminCompanyManagementController);
container
  .bind<IAdminSkillController>(TYPES.AdminSkillController)
  .to(AdminSkillController);

// middleware***********************
container.bind<IAuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);

// common
// ********************************// service
container.bind<ISkillService>(TYPES.SkillService).to(SkillService);
// ********************************// controller
container.bind<ISkillController>(TYPES.SkillController).to(SkillController);
export default container;
