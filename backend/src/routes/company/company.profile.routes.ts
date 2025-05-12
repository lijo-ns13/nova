import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { ICompanyProfileController } from "../../interfaces/controllers/ICompanyProfileController";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const profileController = container.get<ICompanyProfileController>(
  TYPES.CompanyProfileController
);

const router = Router();
router.use(authMiddleware.authenticate("company"));
router.use(authMiddleware.check());

// GET /api/company/profile - Basic profile info
router.get("/", (req, res, next) =>
  profileController.getCompanyProfile(req, res).catch(next)
);

// GET /api/company/profile/details - Full profile with extra info
router.get("/details", (req, res, next) =>
  profileController.getCompanyProfileWithDetails(req, res).catch(next)
);

// PUT /api/company/profile - Update profile info
router.put("/", (req, res, next) =>
  profileController.updateCompanyProfile(req, res).catch(next)
);

// PUT /api/company/profile/image - Update profile image
router.put("/image", (req, res, next) =>
  profileController.updateProfileImage(req, res).catch(next)
);

// DELETE /api/company/profile/image - Delete profile image
router.delete("/image", (req, res, next) =>
  profileController.deleteProfileImage(req, res).catch(next)
);

// PUT /api/company/profile/change-password - Change password
router.put("/change-password", (req, res, next) =>
  profileController.changePassword(req, res).catch(next)
);
export default router;
