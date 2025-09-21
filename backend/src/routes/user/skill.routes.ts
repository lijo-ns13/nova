import { Router } from "express";
import { IUserSkillController } from "../../interfaces/controllers/IUserSkillController";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import container from "../../di/container";
import { COMMON_ROUTES } from "../../constants/routes/commonRoutes";
import { AUTH_ROLES } from "../../constants/auth.roles.constant";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const skillController = container.get<IUserSkillController>(
  TYPES.UserSkillController
);

const router = Router();
router.use(authMiddleware.authenticate(AUTH_ROLES.USER));
router.use(authMiddleware.check());

router.get(
  COMMON_ROUTES.USER,
  skillController.getUserSkills.bind(skillController)
);
router.post(COMMON_ROUTES.ROOT, skillController.addSkill.bind(skillController));

router.delete(
  COMMON_ROUTES.SKILL_BY_ID,
  skillController.removeSkill.bind(skillController)
);

export default router;
