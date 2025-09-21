import { Router } from "express";

import { TYPES } from "../../di/types";
import { IAdminAuthController } from "../../interfaces/controllers/IAdminAuthController";
import container from "../../di/container";
import { AUTH_ROUTES } from "../../constants/routes/authRoutes";

const adminAuthController = container.get<IAdminAuthController>(
  TYPES.AdminAuthController
);
const router = Router();

router.post(AUTH_ROUTES.SIGNIN, (req, res) =>
  adminAuthController.signIn(req, res)
);

export default router;
