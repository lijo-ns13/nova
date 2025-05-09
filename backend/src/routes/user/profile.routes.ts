import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { IUserProfileController } from "../../interfaces/controllers/IUserProfileController";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const userProfileController = container.get<IUserProfileController>(
  TYPES.UserProfileController
);

const router = Router();
router.use(authMiddleware.authenticate("user"));
router.patch("/change-password", (req, res) =>
  userProfileController.changePassword(req, res)
);
router.get("/:userId", (req, res) =>
  userProfileController.getUserProfile(req, res)
);
router.patch("/:userId", (req, res) =>
  userProfileController.updateUserProfile(req, res)
);
router.put("/:userId/profile-image", (req, res) =>
  userProfileController.updateProfileImage(req, res)
);
router.delete("/:userId/profile-image", (req, res) =>
  userProfileController.deleteProfileImage(req, res)
);

// Education Routes
router.post("/:userId/education", (req, res) =>
  userProfileController.addEducation(req, res)
);
router.patch(
  "/:userId/education/:educationId",
  (
    req,
    res // Added educationId
  ) => userProfileController.editEducation(req, res)
);
router.delete("/:userId/education/:educationId", (req, res) =>
  userProfileController.deleteEducation(req, res)
);

// Experience Routes
router.post("/:userId/experience", (req, res) =>
  userProfileController.addExperience(req, res)
);
router.patch("/:userId/experience/:experienceId", (req, res) =>
  userProfileController.editExperience(req, res)
);
router.delete("/:userId/experience/:experienceId", (req, res) =>
  userProfileController.deleteExperience(req, res)
);

// Project Routes
router.post("/:userId/project", (req, res) =>
  userProfileController.addProject(req, res)
);
router.patch("/:userId/project/:projectId", (req, res) =>
  userProfileController.editProject(req, res)
);
router.delete("/:userId/project/:projectId", (req, res) =>
  userProfileController.deleteProject(req, res)
);

// Certificate Routes
router.post("/:userId/certificate", (req, res) =>
  userProfileController.addCertificate(req, res)
);
router.patch("/:userId/certificate/:certificateId", (req, res) =>
  userProfileController.editCertificate(req, res)
);
router.delete("/:userId/certificate/:certificateId", (req, res) =>
  userProfileController.deleteCertificate(req, res)
);
// Education Routes
router.get("/:userId/educations", (req, res) =>
  userProfileController.getAllEducations(req, res)
);

// Experience Routes
router.get("/:userId/experiences", (req, res) =>
  userProfileController.getAllExperiences(req, res)
);

// Project Routes
router.get("/:userId/projects", (req, res) =>
  userProfileController.getAllProjects(req, res)
);

// Certificate Routes
router.get("/:userId/certificates", (req, res) =>
  userProfileController.getAllCertificates(req, res)
);
export default router;
