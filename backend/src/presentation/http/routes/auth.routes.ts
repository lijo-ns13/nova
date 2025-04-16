import { IAdminAuthController } from "../../../core/interfaces/controllers/IAdminAuthController";
import { ICompanyAuthController } from "../../../core/interfaces/controllers/ICompanyAuthController";
import { IAuthController } from "../../../core/interfaces/controllers/IUserAuthService";
import container from "../../../di/container";
import { TYPES } from "../../../di/types";
import { Router } from "express";
const authController = container.get<IAuthController>(TYPES.AuthController);
const companyAuthController = container.get<ICompanyAuthController>(
  TYPES.CompanyAuthController
);
const adminAuthController = container.get<IAdminAuthController>(
  TYPES.AdminAuthController
);
const router = Router();

// user auth
router.post("/signup", (req, res) => authController.signUp(req, res));
router.post("/signin", (req, res) => authController.signIn(req, res));
router.post("/verify", (req, res) => authController.verifyOTP(req, res));
router.post("/resend", (req, res) => authController.resendOTP(req, res));
router.get("/logout", (req, res) => authController.logout(req, res));
router.post("/forget-password", (req, res) =>
  authController.forgetPassword(req, res)
);
router.post("/reset-password", (req, res) =>
  authController.resetPassword(req, res)
);

// company auth
router.post("/company/signin", (req, res) =>
  companyAuthController.signIn(req, res)
);
router.post("/company/signup", (req, res) =>
  companyAuthController.signUp(req, res)
);
router.post("/company/verify", (req, res) =>
  companyAuthController.verify(req, res)
);
router.post("/company/resend", (req, res) =>
  companyAuthController.resend(req, res)
);
router.get("/company/logout", (req, res) =>
  companyAuthController.logout(req, res)
);

// admin
router.post("/admin/signin", adminAuthController.signIn);

export default router;
