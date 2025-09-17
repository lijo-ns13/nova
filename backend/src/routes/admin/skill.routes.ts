import { Router } from "express";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { IAdminSkillController } from "../../interfaces/controllers/IAdminSkillController";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const skillController = container.get<IAdminSkillController>(
  TYPES.AdminSkillController
);

const router = Router();
router.use(authMiddleware.authenticate("admin"));

router.post("/skills", (req, res, next) =>
  skillController.createSkill(req, res, next)
);
router.get("/skills", (req, res, next) =>
  skillController.getAllSkill(req, res, next)
);
router.get("/skills/:id", (req, res, next) =>
  skillController.getByIdSkill(req, res, next)
);
router.patch("/skills/:id", (req, res, next) =>
  skillController.updateSkill(req, res, next)
);
router.delete("/skills/:id", (req, res, next) =>
  skillController.deleteSkill(req, res, next)
);

export default router;
