import { Router } from "express";

import container from "../../di/container";
import { IAuthController } from "../../interfaces/controllers/IUserAuthController";
import { TYPES } from "../../di/types";
import { AUTH_ROUTES } from "../../constants/routes/authRoutes";

const authController = container.get<IAuthController>(TYPES.AuthController);

const router = Router();

router.post(AUTH_ROUTES.SIGNUP, (req, res) => authController.signUp(req, res));
router.post(AUTH_ROUTES.SIGNIN, (req, res) => authController.signIn(req, res));
router.post(AUTH_ROUTES.VERIFY, (req, res) =>
  authController.verifyOTP(req, res)
);
router.post(AUTH_ROUTES.RESEND, (req, res) =>
  authController.resendOTP(req, res)
);
router.get(AUTH_ROUTES.LOGOUT, (req, res) => authController.logout(req, res));
router.post(AUTH_ROUTES.FORGOT_PASSWORD, (req, res) =>
  authController.forgetPassword(req, res)
);
router.post(AUTH_ROUTES.RESET_PASSWORD, (req, res) =>
  authController.resetPassword(req, res)
);

export default router;
