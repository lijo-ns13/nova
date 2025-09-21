import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { ICompanyProfileController } from "../../interfaces/controllers/ICompanyProfileController";
import { COMMON_ROUTES } from "../../constants/routes/commonRoutes";
import { AUTH_ROLES } from "../../constants/auth.roles.constant";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const profileController = container.get<ICompanyProfileController>(
  TYPES.CompanyProfileController
);

const router = Router();
router.use(authMiddleware.authenticate(AUTH_ROLES.COMPANY));
router.use(authMiddleware.check());

router.get(COMMON_ROUTES.ROOT, (req, res, next) =>
  profileController.getCompanyProfile(req, res).catch(next)
);

router.get(COMMON_ROUTES.DETAILS, (req, res, next) =>
  profileController.getCompanyProfileWithDetails(req, res).catch(next)
);

router.patch(COMMON_ROUTES.ROOT, (req, res, next) =>
  profileController.updateCompanyProfile(req, res).catch(next)
);

router.put(COMMON_ROUTES.IMAGE, (req, res, next) =>
  profileController.updateProfileImage(req, res).catch(next)
);

router.delete(COMMON_ROUTES.IMAGE, (req, res, next) =>
  profileController.deleteProfileImage(req, res).catch(next)
);

router.put(COMMON_ROUTES.CHANGE_PASSWORD, (req, res, next) =>
  profileController.changePassword(req, res).catch(next)
);
export default router;
