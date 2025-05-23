import { UserInterviewController } from "../controllers/user/UserInterview.controller";
import applicationModal from "../models/application.modal";
import { UserInterviewService } from "../services/user/UserInterviewService";
import { UserSkillService } from "../services/user/UserSkillService";

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
  SkillRepository: Symbol.for("SkillRepository"),
  //                   post related
  PostRepository: Symbol.for("PostRepository"),
  CommentRepository: Symbol.for("CommentRepository"),
  LikeRepository: Symbol.for("LikeRepository"),
  likeModal: Symbol.for("likeModal"),
  MediaRepository: Symbol.for("MediaRepository"),

  postModal: Symbol.for("postModal"),
  // services**************************************
  // user
  UserAuthService: Symbol.for("UserAuthService"),
  EmailService: Symbol.for("EmailService"),
  AuthMiddleware: Symbol.for("AuthMiddleware"),
  JWTService: Symbol.for("JWTService"),
  UserJobService: Symbol.for("UserJobService"),
  UserProfileService: Symbol.for("UserProfileService"),
  UserService: Symbol.for("UserService"),
  // post reltaed
  PostService: Symbol.for("PostService"),
  CommentService: Symbol.for("CommentService"),
  LikeService: Symbol.for("LikeService"),
  MediaService: Symbol.for("MediaService"),
  // company
  CompanyAuthService: Symbol.for("CompanyAuthService"),
  CompanyJobService: Symbol.for("CompanyJobService"),
  CompanyService: Symbol.for("CompanyService"),
  CompanyProfileService: Symbol.for("CompanyProfileService"),
  // admin
  AdminAuthService: Symbol.for("AdminAuthService"),
  AdminUserManagementService: Symbol.for("AdminUserManagementService"),
  AdminCompanyManagementService: Symbol.for("AdminCompanyManagementService"),
  AdminSkillService: Symbol.for("AdminSkillService"),
  // controller*********************************
  // user
  AuthController: Symbol.for("AuthController"),
  UserJobController: Symbol.for("UserJobController"),
  UserProfileController: Symbol.for("UserProfileController"),
  // pst relted
  PostController: Symbol.for("PostController"),
  CommentController: Symbol.for("CommentController"),
  MediaController: Symbol.for("MediaController"),
  LikeController: Symbol.for("LikeController"),
  // company
  CompanyAuthController: Symbol.for("CompanyAuthController"),
  CompanyJobController: Symbol.for("CompanyJobController"),
  CompanyProfileController: Symbol.for("CompanyProfileController"),
  // admin
  AdminAuthController: Symbol.for("AdminAuthController"),
  AdminUserManagementController: Symbol.for("AdminUserManagementController"),
  AdminCompanyManagementController: Symbol.for(
    "AdminCompanyManagementController"
  ),
  AdminSkillController: Symbol.for("AdminSkillController"),

  // common***********************

  // ********************************// service
  SkillService: Symbol.for("SkillService"),
  ProfileViewService: Symbol.for("ProfileViewService"),
  // ********************************// controller
  SkillController: Symbol.for("SkillController"),
  ProfileViewController: Symbol.for("ProfileViewController"),

  //comapnyside interivew
  InterviewRepository: Symbol.for("InterviewRepository"),
  Interview: Symbol.for("Interview"),
  ApplicationRepository: Symbol.for("ApplicationRepository"),
  applicationModal: Symbol.for("applicationModal"),
  CompanyInterviewService: Symbol.for("CompanyInterviewService"),
  CompanyInterviewController: Symbol.for("CompanyInterviewController"),

  // user interview
  UserInterviewService: Symbol.for("UserInterviewService"),
  UserInterviewController: Symbol.for("UserInterviewController"),

  // user skilll
  UserSkillService: Symbol.for("UserSkillService"),
  UserSkillController: Symbol.for("UserSkillController"),
};
