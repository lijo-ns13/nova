import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { IUserProfileController } from "../../interfaces/controllers/IUserProfileController";
import multer from "multer";
import { USER_PROFILE_ROUTES } from "../../constants/routes/userRoutes";
import { AUTH_ROLES } from "../../constants/auth.roles.constant";

const storage = multer.memoryStorage(); // Suitable for cloud uploads like S3
const upload = multer({ storage });

export const uploadMedia = upload.single("file"); // 'media' should match your form field name

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const userProfileController = container.get<IUserProfileController>(
  TYPES.UserProfileController
);

const router = Router();
router.use(authMiddleware.authenticate(AUTH_ROLES.USER));
router.use(authMiddleware.check());
router.patch(USER_PROFILE_ROUTES.CHANGE_PASSWORD, (req, res) =>
  userProfileController.changePassword(req, res)
);
router.get(USER_PROFILE_ROUTES.ROOT, (req, res) =>
  userProfileController.getUserProfile(req, res)
);
router.patch(USER_PROFILE_ROUTES.ROOT, (req, res) =>
  userProfileController.updateUserProfile(req, res)
);
router.put(USER_PROFILE_ROUTES.PROFILE_IMAGE, uploadMedia, (req, res) =>
  userProfileController.updateProfileImage(req, res)
);
router.delete(USER_PROFILE_ROUTES.PROFILE_IMAGE, (req, res) =>
  userProfileController.deleteProfileImage(req, res)
);

// Education Routes
router.post(USER_PROFILE_ROUTES.EDUCATION, (req, res) =>
  userProfileController.addEducation(req, res)
);
router.patch(
  USER_PROFILE_ROUTES.EDUCATION_ID,
  (
    req,
    res // Added educationId
  ) => userProfileController.editEducation(req, res)
);
router.delete(USER_PROFILE_ROUTES.EDUCATION_ID, (req, res) =>
  userProfileController.deleteEducation(req, res)
);

// Experience Routes
router.post(USER_PROFILE_ROUTES.EXPERIENCE, (req, res) =>
  userProfileController.addExperience(req, res)
);
router.patch(USER_PROFILE_ROUTES.EXPERIENCE_ID, (req, res) =>
  userProfileController.editExperience(req, res)
);
router.delete(USER_PROFILE_ROUTES.EXPERIENCE_ID, (req, res) =>
  userProfileController.deleteExperience(req, res)
);

// Project Routes
router.post(USER_PROFILE_ROUTES.PROJECT, (req, res) =>
  userProfileController.addProject(req, res)
);
router.patch(USER_PROFILE_ROUTES.PROJECT_ID, (req, res) =>
  userProfileController.editProject(req, res)
);
router.delete(USER_PROFILE_ROUTES.PROJECT_ID, (req, res) =>
  userProfileController.deleteProject(req, res)
);

// Certificate Routes
router.post(USER_PROFILE_ROUTES.CERTIFICATE, (req, res) =>
  userProfileController.addCertificate(req, res)
);
router.patch(USER_PROFILE_ROUTES.CERTIFICATE_ID, (req, res) =>
  userProfileController.editCertificate(req, res)
);
router.delete(USER_PROFILE_ROUTES.CERTIFICATE_ID, (req, res) =>
  userProfileController.deleteCertificate(req, res)
);

router.get(USER_PROFILE_ROUTES.EDUCATIONS, (req, res) =>
  userProfileController.getAllEducations(req, res)
);

router.get(USER_PROFILE_ROUTES.EXPERIENCES, (req, res) =>
  userProfileController.getAllExperiences(req, res)
);

router.get(USER_PROFILE_ROUTES.PROJECTS, (req, res) =>
  userProfileController.getAllProjects(req, res)
);

router.get(USER_PROFILE_ROUTES.CERTIFICATES, (req, res) =>
  userProfileController.getAllCertificates(req, res)
);
export default router;
