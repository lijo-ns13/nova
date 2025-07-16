import { IAdminAuthController } from "../interfaces/controllers/IAdminAuthController";
import { ICompanyAuthController } from "../interfaces/controllers/ICompanyAuthController";
import { IAuthController } from "../interfaces/controllers/IUserAuthController";
import container from "../di/container";
import { TYPES } from "../di/types";
import { Router } from "express";
import multer from "multer";

const storage = multer.memoryStorage(); // Suitable for cloud uploads like S3
const upload = multer({ storage });

export const uploadMedia = upload.array("media"); // 'media' should match your form field name

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
router.post("/company/signup", uploadMedia, (req, res) =>
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
router.post("/company/forget-password", (req, res) =>
  companyAuthController.forgetPassword(req, res)
);
router.post("/company/reset-password", (req, res) =>
  companyAuthController.resetPassword(req, res)
);
// admin
router.post("/admin/signin", (req, res) =>
  adminAuthController.signIn(req, res)
);

export default router;
