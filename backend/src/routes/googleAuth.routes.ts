import { Router, Request, Response, NextFunction } from "express";
import container from "../di/container";
import { UserGoogleController } from "../controllers/user/userGoogleController";
import { TYPES } from "../di/types";

const router = Router();
const googleController = container.get<UserGoogleController>(
  TYPES.UserGoogleController
);

// Async error handling middleware
const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Google OAuth routes
router.get("/google", (req, res) =>
  googleController.redirectToGoogle(req, res)
);
router.get(
  "/google/callback",
  catchAsync(googleController.handleGoogleCallback.bind(googleController))
);
router.post(
  "/refresh-token",
  catchAsync(googleController.refreshAccessToken.bind(googleController))
);
router.get("/me", catchAsync(googleController.getUser.bind(googleController)));
router.get(
  "/refresh-user",
  catchAsync(googleController.refreshUser.bind(googleController))
);
router.get(
  "/refresh",
  catchAsync(googleController.refreshAccessToken.bind(googleController))
);

export default router;
