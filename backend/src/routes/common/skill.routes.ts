import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { ISkillController } from "../../interfaces/controllers/ISkillController";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { COMMON_ROUTES } from "../../constants/routes/commonRoutes";

const skillController = container.get<ISkillController>(TYPES.SkillController);
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const router = Router();

router.use(authMiddleware.authenticate("user"));

router.get(
  COMMON_ROUTES.SEARCH,
  skillController.searchSkills.bind(skillController)
);

export default router;
