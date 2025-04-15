import { IAuthController } from "../../../core/interfaces/controllers/IUserAuthService";
import container from "../../../di/container";
import { TYPES } from "../../../di/types";
import { Router } from "express";
const authController = container.get<IAuthController>(TYPES.AuthController);

const router = Router();

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.post("/verify", authController.verifyOTP);
router.post("/resend", authController.resendOTP);
router.get("/logout", authController.logout);
router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password", authController.resetPassword);

export default router;
