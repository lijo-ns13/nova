import { Router } from "express";
import { IUserSkillController } from "../../interfaces/controllers/IUserSkillController";
import { TYPES } from "../../di/types";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import container from "../../di/container";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const userSkillController = container.get<IUserSkillController>(
  TYPES.UserSkillController
);

const router = Router();
router.use(authMiddleware.authenticate("user"));
router.use(authMiddleware.check());

// Get all skills for the authenticated user
router.get("/", (req, res) => userSkillController.getUserSkills(req, res));

// Add skills to the authenticated user
router.post("/", (req, res) => userSkillController.addSkills(req, res));

// Delete a specific skill from the authenticated user
router.delete("/:skillId", (req, res) =>
  userSkillController.deleteSkill(req, res)
);

export default router;
