import { Router } from "express";
import multer from "multer";
import { TYPES } from "../../di/types";
import container from "../../di/container";
import { ICompanyAuthController } from "../../interfaces/controllers/ICompanyAuthController";
import { AUTH_ROUTES } from "../../constants/routes/authRoutes";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadMedia = upload.array("media");

const companyAuthController = container.get<ICompanyAuthController>(
  TYPES.CompanyAuthController
);

const router = Router();

router.post(AUTH_ROUTES.SIGNIN, (req, res) =>
  companyAuthController.signIn(req, res)
);
router.post(AUTH_ROUTES.SIGNUP, uploadMedia, (req, res) =>
  companyAuthController.signUp(req, res)
);
router.post(AUTH_ROUTES.VERIFY, (req, res) =>
  companyAuthController.verify(req, res)
);
router.post(AUTH_ROUTES.RESEND, (req, res) =>
  companyAuthController.resend(req, res)
);
router.get(AUTH_ROUTES.LOGOUT, (req, res) =>
  companyAuthController.logout(req, res)
);
router.post(AUTH_ROUTES.FORGOT_PASSWORD, (req, res) =>
  companyAuthController.forgetPassword(req, res)
);
router.post(AUTH_ROUTES.RESET_PASSWORD, (req, res) =>
  companyAuthController.resetPassword(req, res)
);

export default router;
