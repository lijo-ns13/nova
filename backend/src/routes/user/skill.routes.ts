import { Router } from "express";
import { IUserSkillController } from "../../interfaces/controllers/IUserSkillController";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import container from "../../di/container";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const skillController = container.get<IUserSkillController>(
  TYPES.UserSkillController
);

const router = Router();
router.use(authMiddleware.authenticate("user"));
router.use(authMiddleware.check());

router.get("/user", skillController.getUserSkills.bind(skillController));
router.post("/", skillController.addSkill.bind(skillController));

router.delete("/:skillId", skillController.removeSkill.bind(skillController));

export default router;
