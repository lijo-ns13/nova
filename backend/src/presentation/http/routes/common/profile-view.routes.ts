import { Router } from "express";
import container from "../../../../di/container";
import { TYPES } from "../../../../di/types";
import { IAuthMiddleware } from "../../../../core/interfaces/middlewares/IAuthMiddleware";
import { IProfileViewController } from "../../../../core/interfaces/controllers/IProfileViewController";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const dataController = container.get<IProfileViewController>(
  TYPES.ProfileViewController
);

const router = Router();
router.use(authMiddleware.authenticateMultiple(["user", "admin", "company"]));

router.get("/users/:username", (req, res) =>
  dataController.getUserBasicData(req, res)
);
router.get("/users/post/:username", (req, res) =>
  dataController.getUserPostData(req, res)
);
export default router;
