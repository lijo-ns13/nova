import { Router } from "express";
import authRouter from "./auth/index";
import adminRouter from "./admin/index";
import companyRouter from "./company/index";
import userRouter from "./user/index";
import sharedRouter from "./common/index";
const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/company", companyRouter);
router.use("/", userRouter);
router.use("/", sharedRouter);

export default router;
