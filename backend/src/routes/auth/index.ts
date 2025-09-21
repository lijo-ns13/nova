import { Router } from "express";
import userAuthRoutes from "./userAuth.routes";
import companyAuthRoutes from "./companyAuth.routes";
import adminAuthRoutes from "./adminAuth.routes";
import { MAIN_AUTH_ROUTES } from "../../constants/routes/authRoutes";

const router = Router();

router.use(MAIN_AUTH_ROUTES.ADMIN, adminAuthRoutes);
router.use(MAIN_AUTH_ROUTES.COMPANY, companyAuthRoutes);
router.use(MAIN_AUTH_ROUTES.USER, userAuthRoutes);
export default router;
