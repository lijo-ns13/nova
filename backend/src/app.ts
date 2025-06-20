import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
// routers
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import companyRouter from "./routes/company.routes";
import adminRouter from "./routes/admin.routes";
import sharedRouter from "./routes/shared.routes";
import googleRouter from "./routes/google.routes";
import container from "./di/container";
import dashRouter from "./routes/companydash.routes";
// stripe realted
import webhookRoute from "../src/routes/webhook.routes";
import stripeRoutes from "../src/routes/stripe";
import { IAuthMiddleware } from "./interfaces/middlewares/IAuthMiddleware";
import { TYPES } from "./di/types";
import { HTTP_STATUS_CODES } from "./core/enums/httpStatusCode";
import adminAnalyticsRoutes from "./routes/admindash.routes";
import "./cron/userCronJob";
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

const app: Application = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use("/api", webhookRoute); // raw parser used here
app.use(cors(corsOptions));

//middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/auth", authRouter);
app.use("", dashRouter);
app.use("/api/stripe", stripeRoutes);
app.use("/api/auth", googleRouter);
app.use("/", sharedRouter);

app.use("/admin", adminRouter);
app.use("/", userRouter);
app.use("/company", companyRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Global error handler:", err);
  res
    .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal Server Error" });
});

export default app;
