// src/routes/userFollowRoutes.ts

import { Router } from "express";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IUserFollowController } from "../../interfaces/controllers/IUserFollowController";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);
const userFollowController = container.get<IUserFollowController>(
  TYPES.UserFollowController
);

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware.authenticate("user"));
router.use(authMiddleware.check());

// Follow a user
router.post("/:userId/follow", (req, res) =>
  userFollowController.followUser(req, res)
);

// Unfollow a user
router.post("/:userId/unfollow", (req, res) =>
  userFollowController.unfollowUser(req, res)
);

// Get a user's followers
router.get("/:userId/followers", (req, res) =>
  userFollowController.getFollowers(req, res)
);

// Get users a user is following
router.get("/:userId/following", (req, res) =>
  userFollowController.getFollowing(req, res)
);

// Check if current user is following another user
router.get("/:userId/follow-status", (req, res) =>
  userFollowController.checkFollowStatus(req, res)
);

export default router;
