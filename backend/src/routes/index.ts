import { Router } from "express";
import authRouter from "./auth/index";
import adminRouter from "./admin/index";
import companyRouter from "./company/index";
import userRouter from "./user/index";
import sharedRouter from "./common/index";
import { MAIN_ROUTES } from "../constants/routes/mainRoutes";
const router = Router();

router.use(MAIN_ROUTES.AUTH, authRouter);
router.use(MAIN_ROUTES.ADMIN, adminRouter);
router.use(MAIN_ROUTES.COMPANY, companyRouter);
router.use(MAIN_ROUTES.USER, userRouter);
router.use(MAIN_ROUTES.SHARED, sharedRouter);

export default router;
