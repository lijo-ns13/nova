export const TYPES = {
  // Repositories
  UserModel: Symbol.for("UserModel"),
  UserRepository: Symbol.for("UserRepository"),
  UserMapper: Symbol.for("UserMapper"),
  TempUserModel: Symbol.for("TempUserModel"),
  TempUserRepository: Symbol.for("TempUserRepository"),
  PasswordResetTokenModel: Symbol.for("PasswordResetTokenModel"),
  PasswordResetTokenRepository: Symbol.for("PasswordResetTokenRepository"),
  OTPModel: Symbol.for("OTPModel"),
  OTPRepository: Symbol.for("OTPRepository"),
  CompanyModel: Symbol.for("CompanyModel"),
  CompanyRepository: Symbol.for("CompanyRepository"),
  TempCompanyModel: Symbol.for("TempCompanyModel"),
  TempCompanyRepository: Symbol.for("TempCompanyRepository"),
  AdminModel: Symbol.for("AdminModel"),
  AdminRepository: Symbol.for("AdminRepository"),

  JobRepository: Symbol.for("JobRepository"),
  jobModel: Symbol.for("jobModel"),
  SkillRepository: Symbol.for("SkillRepository"),
  //                   post related
  PostRepository: Symbol.for("PostRepository"),
  CommentRepository: Symbol.for("CommentRepository"),
  commentModel: Symbol.for("commentModel"),
  LikeRepository: Symbol.for("LikeRepository"),
  likeModel: Symbol.for("likeModel"),
  MediaRepository: Symbol.for("MediaRepository"),
  skillModel: Symbol.for("skillModel"),
  postModel: Symbol.for("postModel"),
  mediaModel: Symbol.for("mediaModel"),
  tranasctionModel: Symbol.for("tranasctionModel"),
  TransactionRepository: Symbol.for("TransactionRepository"),
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
  applicationModel: Symbol.for("applicationModel"),
  CompanyInterviewService: Symbol.for("CompanyInterviewService"),
  CompanyInterviewController: Symbol.for("CompanyInterviewController"),

  // user interview
  UserInterviewService: Symbol.for("UserInterviewService"),
  UserInterviewController: Symbol.for("UserInterviewController"),

  // user skilll
  UserSkillService: Symbol.for("UserSkillService"),
  UserSkillController: Symbol.for("UserSkillController"),

  // follow related user
  UserFollowService: Symbol.for("UserFollowService"),
  UserFollowController: Symbol.for("UserFollowController"),

  NotificationRepository: Symbol.for("NotificationRepository"),
  NotificationService: Symbol.for("NotificationService"),
  NotificationController: Symbol.for("NotificationController"),
  SocketIO: Symbol.for("SocketIO"),
  // subscritption realted admin side
  SubscriptionPlanRepository: Symbol.for("SubscriptionPlanRepository"),
  SubscriptionPlanService: Symbol.for("SubscriptionPlanService"),
  SubscriptionPlanController: Symbol.for("SubscriptionPlanController"),
  subscriptionModel: Symbol.for("subscriptionModel"),
  // feature reatled admin side
  featureModel: Symbol.for("FeatureModel"),
  FeatureRepository: Symbol.for("FeatureRepository"),
  FeatureService: Symbol.for("FeatureService"),
  FeatureController: Symbol.for("FeatureController"),
  // user side
  SubscriptionWithFeaturesRepository: Symbol.for(
    "SubscriptionWithFeaturesRepository"
  ),
  SubscriptionWithFeaturesService: Symbol.for(
    "SubscriptionWithFeaturesService"
  ),
  SubscriptionWithFeaturesController: Symbol.for(
    "SubscriptionWithFeaturesController"
  ),
  // appicant
  JobApplicantManagementService: Symbol.for("JobApplicantManagementService"),
  JobApplicantManagementController: Symbol.for(
    "JobApplicantManagementController"
  ),
  // company stat
  CompanyDashboardController: Symbol.for("CompanyDashboardController"),
  CompanyDashboardService: Symbol.for("CompanyDashboardService"),
  // admin dashb
  AdminDashboardController: Symbol.for("AdminDashboardController"),
  AdminDashboardService: Symbol.for("AdminDashboardService"),
  // TransactionRepository: Symbol.for("TransactionRepository"),
  // SubscriptionPlanRepository: Symbol.for("SubscriptionPlanRepository"),
  StripeService: Symbol.for("StripeService"),
  StripeController: Symbol.for("StripeController"),
};
