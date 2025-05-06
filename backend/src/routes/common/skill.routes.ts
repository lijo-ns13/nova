import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";

import { ISkillController } from "../../core/interfaces/controllers/ISkillController";

const skillController = container.get<ISkillController>(TYPES.SkillController);

const router = Router();
router.get("/search", skillController.searchSkills.bind(skillController));

export default router;
