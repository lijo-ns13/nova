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

router.post("/skills", (req, res) => skillController.create(req, res));
router.get("/skills", (req, res) => skillController.getAll(req, res));
router.get("/skills/:id", (req, res) => skillController.getById(req, res));
router.patch("/skills/:id", (req, res) => skillController.update(req, res));
router.delete("/skills/:id", (req, res) => skillController.delete(req, res));

export default router;
