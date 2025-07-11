import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { IUserProfileController } from "../../interfaces/controllers/IUserProfileController";
import multer from "multer";

const storage = multer.memoryStorage(); // Suitable for cloud uploads like S3
const upload = multer({ storage });

export const uploadMedia = upload.single("file"); // 'media' should match your form field name

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const userProfileController = container.get<IUserProfileController>(
  TYPES.UserProfileController
);

const router = Router();
router.use(authMiddleware.authenticate("user"));
router.use(authMiddleware.check());
router.patch("/change-password", (req, res) =>
  userProfileController.changePassword(req, res)
);
router.get("/", (req, res) => userProfileController.getUserProfile(req, res));
router.patch("/", (req, res) =>
  userProfileController.updateUserProfile(req, res)
);
router.put("/profile-image", uploadMedia, (req, res) =>
  userProfileController.updateProfileImage(req, res)
);
router.delete("/profile-image", (req, res) =>
  userProfileController.deleteProfileImage(req, res)
);

// Education Routes
router.post("/education", (req, res) =>
  userProfileController.addEducation(req, res)
);
router.patch(
  "/education/:educationId",
  (
    req,
    res // Added educationId
  ) => userProfileController.editEducation(req, res)
);
router.delete("/education/:educationId", (req, res) =>
  userProfileController.deleteEducation(req, res)
);

// Experience Routes
router.post("/experience", (req, res) =>
  userProfileController.addExperience(req, res)
);
router.patch("/experience/:experienceId", (req, res) =>
  userProfileController.editExperience(req, res)
);
router.delete("/experience/:experienceId", (req, res) =>
  userProfileController.deleteExperience(req, res)
);

// Project Routes
router.post("/project", (req, res) =>
  userProfileController.addProject(req, res)
);
router.patch("/project/:projectId", (req, res) =>
  userProfileController.editProject(req, res)
);
router.delete("/project/:projectId", (req, res) =>
  userProfileController.deleteProject(req, res)
);

// Certificate Routes
router.post("/certificate", (req, res) =>
  userProfileController.addCertificate(req, res)
);
router.patch("/certificate/:certificateId", (req, res) =>
  userProfileController.editCertificate(req, res)
);
router.delete("/certificate/:certificateId", (req, res) =>
  userProfileController.deleteCertificate(req, res)
);
// Education Routes
router.get("/educations", (req, res) =>
  userProfileController.getAllEducations(req, res)
);

// Experience Routes
router.get("/experiences", (req, res) =>
  userProfileController.getAllExperiences(req, res)
);

// Project Routes
router.get("/projects", (req, res) =>
  userProfileController.getAllProjects(req, res)
);

// Certificate Routes
router.get("/certificates", (req, res) =>
  userProfileController.getAllCertificates(req, res)
);
export default router;
