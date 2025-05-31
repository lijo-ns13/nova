import { Container } from "inversify";
import { TYPES } from "./types";

import userModal from "../models/user.modal";

import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { ITempUserRepository } from "../interfaces/repositories/ITempUserRepository";

import { TempUserRepository } from "../repositories/mongo/TempUserRepository";
import { UserRepository } from "../repositories/mongo/UserRepository";
import { ITempCompanyRepository } from "../interfaces/repositories/ITempCompanyRepository";
import { TempCompanyRepository } from "../repositories/mongo/TempCompanyRepository";
import { ICompanyRepository } from "../interfaces/repositories/ICompanyRepository";
import { CompanyRepository } from "../repositories/mongo/CompanyRepository";
import { IOTPRepository } from "../interfaces/repositories/IOTPRepository";
import { IPasswordResetTokenRepository } from "../interfaces/repositories/IPasswordResetTokenRepository";
import { OTPRepository } from "../repositories/mongo/OTPRepository";
import { PasswordResetTokenRepository } from "../repositories/mongo/PasswordResetTokenRepository";
import { IUserAuthService } from "../interfaces/services/IUserAuthService";
import { IEmailService } from "../interfaces/services/IEmailService";
import { EmailService } from "../services/user/Email.Service";
import { UserAuthService } from "../services/user/UserAuthService";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { JWTService } from "../shared/util/jwt.service";
import { AuthController } from "../controllers/user/AuthController";
import { IAuthController } from "../interfaces/controllers/IUserAuthController";
import { IUser } from "../models/user.modal";
import { Model } from "mongoose";
import otpModal, { IOTP } from "../models/otp.modal";
import userTempModal, { ITempUser } from "../models/user.temp.modal";
import PasswordResetToken, {
  IPasswordResetToken,
} from "../models/PasswordResetToken";
import { CompanyAuthController } from "../controllers/company/CompanyAuthController";
import { CompanyAuthService } from "../services/company/CompanyAuthService";
import { ICompanyAuthService } from "../interfaces/services/ICompanyAuthService";
import { ICompanyAuthController } from "../interfaces/controllers/ICompanyAuthController";
import companyModal, { ICompany } from "../models/company.modal";
import companyTempModal, { ITempCompany } from "../models/company.temp.modal";
import { Admin } from "../models/admin.modal";
import { AdminRepository } from "../repositories/mongo/AdminRepository";
import { IAdminRepository } from "../interfaces/repositories/IAdminRepository";
import { AdminAuthService } from "../services/admin/AdminAuthService";
import { IAdminAuthService } from "../interfaces/services/IAdminAuthService";
import { AdminAuthController } from "../controllers/admin/AdminAuthController";
import { IAdminAuthController } from "../interfaces/controllers/IAdminAuthController";
import { IJobRepository } from "../interfaces/repositories/IJobRepository";
import { JobRepository } from "../repositories/mongo/JobRepository";
import { IUserJobService } from "../interfaces/services/IUserJobService";
import { UserJobService } from "../services/user/UserJobService";
import { IUserJobController } from "../interfaces/controllers/IUserJobController";
import { UserJobController } from "../controllers/user/UserJobController";
import { IAuthMiddleware } from "../interfaces/middlewares/IAuthMiddleware";
import { IJWTService } from "../interfaces/services/IJwtService";
import { ICompanyJobService } from "../interfaces/services/ICompanyJobService";
import { CompanyJobService } from "../services/company/CompanyJobService";
import { CompanyJobController } from "../controllers/company/CompanyJobController";
import { ICompanyJobController } from "../interfaces/controllers/ICompanyJobController";
import { IAdminUserManagementService } from "../interfaces/services/IAdminUserManagementService";
import { AdminUserManagementService } from "../services/admin/AdminUserManagementService";
import { IAdminUserManagementController } from "../interfaces/controllers/IAdminUserManagementController ";
import { AdminUserManagementController } from "../controllers/admin/AdminUserManagementController";
import { IAdminCompanyManagementController } from "../interfaces/controllers/IAdminCompanyManagementController";
import { AdminCompanyManagementController } from "../controllers/admin/AdminCompanyManagementController";
import { IAdminCompanyManagementService } from "../interfaces/services/IAdminCompanyManagementService ";
import { AdminCompanyManagementService } from "../services/admin/AdminCompanyManagementService";
import { ISkillRepository } from "../interfaces/repositories/ISkillRepository";
import { SkillRepository } from "../repositories/mongo/SkillRepository";
import { AdminSkillController } from "../controllers/admin/AdminSkillController";
import { IAdminSkillService } from "../interfaces/services/IAdminSkillService";
import { AdminSkillService } from "../services/admin/AdminSkillService";
import { IAdminSkillController } from "../interfaces/controllers/IAdminSkillController";
import { UserProfileController } from "../controllers/user/UserProfileController";
import { IUserProfileService } from "../interfaces/services/IUserProfileService";
import { UserProfileService } from "../services/user/UserProfileService";
import { IUserProfileController } from "../interfaces/controllers/IUserProfileController";
import { SkillService } from "../services/SkillService";
import { ISkillService } from "../interfaces/services/ISkillService";
import { SkillController } from "../controllers/SkillController";
import { ISkillController } from "../interfaces/controllers/ISkillController";
import { IPostRepository } from "../interfaces/repositories/IPostRepository";
import { PostRepository } from "../repositories/mongo/PostRepository";
import { ICommentRepository } from "../interfaces/repositories/ICommentRepository";
import { CommentRepository } from "../repositories/mongo/CommentRepository";
import { ILikeRepository } from "../interfaces/repositories/ILikeRepository";
import { LikeRepository } from "../repositories/mongo/LikeRepository";
import { IMediaRepository } from "../interfaces/repositories/IMediaRepository";
import { MediaRepository } from "../repositories/mongo/MediaRepository";
import { IPostService } from "../interfaces/services/Post/IPostService";
import { PostService } from "../services/user/PostService";
import { IMediaService } from "../interfaces/services/Post/IMediaService";

import { MediaService } from "../services/user/MediaService";
import { PostController } from "../controllers/user/PostController";
import { IPostController } from "../interfaces/controllers/post/IPostController";
import postModal, { IPost } from "../models/post.modal";
import { LikeService } from "../services/user/LikeService";
import { ILikeService } from "../interfaces/services/Post/ILikeService";
import likeModal, { ILike } from "../models/like.modal";
import { ICommentService } from "../interfaces/services/ICommentService";
import { CommentService } from "../services/user/CommentService";
import { IProfileViewService } from "../interfaces/services/IProfileViewService";
import { ProfileViewService } from "../services/user/ProfileViewService";
import { IProfileViewController } from "../interfaces/controllers/IProfileViewController";
import { ProfileViewController } from "../controllers/ProfileViewController";
import { ICompanyService } from "../interfaces/services/ICompanyService";
import { CompanyService } from "../services/company/CompanyService";
import { IUserService } from "../interfaces/services/IUserService";
import { UserService } from "../services/user/UserService";
import { ICompanyProfileService } from "../interfaces/services/ICompanyProfileService";
import { CompanyProfileService } from "../services/company/CompanyProfileService";
import { ICompanyProfileController } from "../interfaces/controllers/ICompanyProfileController";
import { CompanyProfileController } from "../controllers/company/CompanyProfileController";

import { IApplicationRepository } from "../interfaces/repositories/IApplicationRepository";
import { InterviewRepository } from "../repositories/mongo/InterviewRepository";
import { ICompanyInterviewController } from "../interfaces/controllers/ICompanyInterviewController";
import { CompanyInterviewController } from "../controllers/company/CompanyInterviewController";
import { CompanyInterviewService } from "../services/company/CompanyInterviewService";
import { ApplicationRepository } from "../repositories/mongo/ApplicationRepository";
import { ICompanyInterviewService } from "../interfaces/services/ICompanyInterviewService";
import { IInterviewRepository } from "../interfaces/repositories/IInterviewRepository";
import { IInterview, Interview } from "../models/interview.modal";
import applicationModal, { IApplication } from "../models/application.modal";
import { IUserInterviewService } from "../interfaces/services/IUserInterviewService";
import { TYPE } from "inversify-express-utils";
import { UserInterviewService } from "../services/user/UserInterviewService";
import { IUserInterviewController } from "../interfaces/controllers/IUserInterviewController";
import { UserInterviewController } from "../controllers/user/UserInterview.controller";
import { IUserSkillService } from "../interfaces/services/IUserSkillService";
import { UserSkillService } from "../services/user/UserSkillService";
import { IUserSkillController } from "../interfaces/controllers/IUserSkillController";
import { UserSkillController } from "../controllers/user/UserSkillController";
import { IUserFollowService } from "../interfaces/services/IUserFollowService";
import { UserFollowService } from "../services/user/UserFollowService";
import { IUserFollowController } from "../interfaces/controllers/IUserFollowController";
import { UserFollowController } from "../controllers/user/UserFollowController";
import { INotificationController } from "../interfaces/controllers/INotificationController";
import { INotificationService } from "../interfaces/services/INotificationService";
import { INotificationRepository } from "../interfaces/repositories/INotificationRepository";
import { NotificationRepository } from "../repositories/mongo/notificationRepository";
import { NotificationService } from "../services/notificationService";
import { NotificationController } from "../controllers/notificationController";
import { ISubscriptionPlanRepository } from "../interfaces/repositories/ISubscriptonPlanRepository";
import { ISubscriptionPlanService } from "../interfaces/services/ISubscriptionPlanService";
import { ISubscriptionPlanController } from "../interfaces/controllers/ISubscriptionPlanController";
import { SubscriptionPlanController } from "../controllers/admin/SubscriptionPlanController";
import { SubscriptionPlanService } from "../services/admin/SubscriptionPlanService";
import { SubscriptionPlanRepository } from "../repositories/mongo/SubscriptionPlanRepository";
import subscriptionModal, {
  ISubscriptionPlan,
} from "../models/subscription.modal";
import { IFeatureRepository } from "../interfaces/repositories/IFeatureRepository";
import { FeatureRepository } from "../repositories/mongo/FeatureRepository";
import featureModal, { IFeature } from "../models/feature.modal";
import { IFeatureService } from "../interfaces/services/IFeatureService";
import { FeatureService } from "../services/admin/FeatureService";
import { IFeatureController } from "../interfaces/controllers/IFeatureController";
import { FeatureController } from "../controllers/admin/FeatureController";
import { ISubscriptionWithFeaturesRepository } from "../interfaces/repositories/ISubscriptionWithFeatures";
import { SubscriptionWithFeaturesRepository } from "../repositories/mongo/SubscriptionWithFeatures";
import { SubscriptionWithFeaturesController } from "../controllers/user/SubscriptionWithFeatureController";
import { SubscriptionWithFeaturesService } from "../services/user/SubscriptionWithFeaturesService";
import { ISubscriptionWithFeaturesService } from "../interfaces/services/ISubscriptionWithFeatures";
import { ISubscriptionWithFeaturesController } from "../interfaces/controllers/ISubscriptionWithFeatures";

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
container.bind<IUserService>(TYPES.UserService).to(UserService);
// company
container
  .bind<ICompanyAuthService>(TYPES.CompanyAuthService)
  .to(CompanyAuthService);
container
  .bind<ICompanyJobService>(TYPES.CompanyJobService)
  .to(CompanyJobService);
container.bind<ICompanyService>(TYPES.CompanyService).to(CompanyService);

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
container
  .bind<IProfileViewService>(TYPES.ProfileViewService)
  .to(ProfileViewService);
// ********************************// controller
container.bind<ISkillController>(TYPES.SkillController).to(SkillController);
container
  .bind<IProfileViewController>(TYPES.ProfileViewController)
  .to(ProfileViewController);

container
  .bind<ICompanyProfileService>(TYPES.CompanyProfileService)
  .to(CompanyProfileService);
container
  .bind<ICompanyProfileController>(TYPES.CompanyProfileController)
  .to(CompanyProfileController);

// companyside interview
// Repositories
container
  .bind<IInterviewRepository>(TYPES.InterviewRepository)
  .to(InterviewRepository);
container.bind<Model<IInterview>>(TYPES.Interview).toConstantValue(Interview);
container
  .bind<IApplicationRepository>(TYPES.ApplicationRepository)
  .to(ApplicationRepository);
container
  .bind<Model<IApplication>>(TYPES.applicationModal)
  .toConstantValue(applicationModal);
// Services
container
  .bind<ICompanyInterviewService>(TYPES.CompanyInterviewService)
  .to(CompanyInterviewService);

// Controllers
container
  .bind<ICompanyInterviewController>(TYPES.CompanyInterviewController)
  .to(CompanyInterviewController);

// user interview
container
  .bind<IUserInterviewService>(TYPES.UserInterviewService)
  .to(UserInterviewService);
container
  .bind<IUserInterviewController>(TYPES.UserInterviewController)
  .to(UserInterviewController);

// user skilll
container.bind<IUserSkillService>(TYPES.UserSkillService).to(UserSkillService);
container
  .bind<IUserSkillController>(TYPES.UserSkillController)
  .to(UserSkillController);

// user follow related
container
  .bind<IUserFollowService>(TYPES.UserFollowService)
  .to(UserFollowService);
container
  .bind<IUserFollowController>(TYPES.UserFollowController)
  .to(UserFollowController);
// Notification bindings
container
  .bind<INotificationRepository>(TYPES.NotificationRepository)
  .to(NotificationRepository);
// .inSingletonScope();
container
  .bind<INotificationService>(TYPES.NotificationService)
  .to(NotificationService);
// .inSingletonScope();
container
  .bind<INotificationController>(TYPES.NotificationController)
  .to(NotificationController);
// .inSingletonScope();

// SocketIO binding (set this up when you create your socket server)
// container.bind<Server>(TYPES.SocketIO).toConstantValue(io);

// subscritption related
container
  .bind<ISubscriptionPlanRepository>(TYPES.SubscriptionPlanRepository)
  .to(SubscriptionPlanRepository);
container
  .bind<Model<ISubscriptionPlan>>(TYPES.subscriptionModal)
  .toConstantValue(subscriptionModal);
container
  .bind<ISubscriptionPlanService>(TYPES.SubscriptionPlanService)
  .to(SubscriptionPlanService);

container
  .bind<ISubscriptionPlanController>(TYPES.SubscriptionPlanController)
  .to(SubscriptionPlanController);

container
  .bind<IFeatureRepository>(TYPES.FeatureRepository)
  .to(FeatureRepository);
container
  .bind<Model<IFeature>>(TYPES.featureModel)
  .toConstantValue(featureModal);
container.bind<IFeatureService>(TYPES.FeatureService).to(FeatureService);
container
  .bind<IFeatureController>(TYPES.FeatureController)
  .to(FeatureController);
// user side
container
  .bind<ISubscriptionWithFeaturesRepository>(
    TYPES.SubscriptionWithFeaturesRepository
  )
  .to(SubscriptionWithFeaturesRepository);
container
  .bind<ISubscriptionWithFeaturesService>(TYPES.SubscriptionWithFeaturesService)
  .to(SubscriptionWithFeaturesService);
container
  .bind<ISubscriptionWithFeaturesController>(
    TYPES.SubscriptionWithFeaturesController
  )
  .to(SubscriptionWithFeaturesController);
export default container;
