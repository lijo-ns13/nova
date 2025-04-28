import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// routers
import authRouter from "./presentation/http/routes/auth.routes";
import userRouter from "./presentation/http/routes/user.routes";
import companyRouter from "./presentation/http/routes/company.routes";
import adminRouter from "./presentation/http/routes/admin.routes";
import sharedRouter from "./presentation/http/routes/shared.routes";
import googleRouter from "./presentation/http/routes/google.routes";
dotenv.config();

const app: Application = express();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

//middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/api/auth", googleRouter);
app.use("/", sharedRouter);
// user auth
app.use("/auth", authRouter);
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/company", companyRouter);

app.use((err: Error, _req: Request, res: Response) => {
  res.status(500).json({
    message: err.message || "something wrong",
  });
});

export default app;
