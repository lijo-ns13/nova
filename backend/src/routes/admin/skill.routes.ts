import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { IAdminSkillController } from "../../interfaces/controllers/IAdminSkillController";
import { COMMON_ROUTES } from "../../constants/routes/commonRoutes";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const skillController = container.get<IAdminSkillController>(
  TYPES.AdminSkillController
);

const router = Router();
router.use(authMiddleware.authenticate("admin"));

router.post(COMMON_ROUTES.ROOT, (req, res, next) =>
  skillController.createSkill(req, res, next)
);
router.get(COMMON_ROUTES.ROOT, (req, res, next) =>
  skillController.getAllSkill(req, res, next)
);
router.get(COMMON_ROUTES.BY_ID, (req, res, next) =>
  skillController.getByIdSkill(req, res, next)
);
router.patch(COMMON_ROUTES.BY_ID, (req, res, next) =>
  skillController.updateSkill(req, res, next)
);
router.delete(COMMON_ROUTES.BY_ID, (req, res, next) =>
  skillController.deleteSkill(req, res, next)
);

export default router;
