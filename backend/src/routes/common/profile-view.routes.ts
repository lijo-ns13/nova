import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { IProfileViewController } from "../../interfaces/controllers/IProfileViewController";
import { PROFILE_VIEW_ROUTES } from "../../constants/routes/commonRoutes";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const dataController = container.get<IProfileViewController>(
  TYPES.ProfileViewController
);

const router = Router();
router.use(authMiddleware.authenticateMultiple(["user", "admin", "company"]));

router.get(PROFILE_VIEW_ROUTES.BY_USERNAME, (req, res) =>
  dataController.getUserBasicData(req, res)
);
router.get(PROFILE_VIEW_ROUTES.POSTS_BY_USERNAME, (req, res) =>
  dataController.getUserPostData(req, res)
);
export default router;
