import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { ISkillController } from "../../interfaces/controllers/ISkillController";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";

const skillController = container.get<ISkillController>(TYPES.SkillController);
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const router = Router();
router.use(authMiddleware.authenticateMultiple(["user", "company"]));
// GET /api/skills/user
router.get("/user", skillController.getUserSkills.bind(skillController));

router.get("/search", skillController.searchSkills.bind(skillController));

router.post("/", skillController.addSkill.bind(skillController));

router.delete("/", skillController.removeSkill.bind(skillController));

export default router;
