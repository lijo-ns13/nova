import { Router } from "express";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import container from "../../di/container";
import { TYPES } from "../../di/types";
import { IUserFollowController } from "../../interfaces/controllers/IUserFollowController";
import { USER_FOLLOW_ROUTES } from "../../constants/routes/userRoutes";
import { AUTH_ROLES } from "../../constants/auth.roles.constant";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);
const userFollowController = container.get<IUserFollowController>(
  TYPES.UserFollowController
);

const router = Router();

router.use(authMiddleware.authenticate(AUTH_ROLES.USER));
router.use(authMiddleware.check());

router.get(USER_FOLLOW_ROUTES.NETWORK_USERS, (req, res) =>
  userFollowController.getNetworkUsers(req, res)
);

router.post(USER_FOLLOW_ROUTES.FOLLOW, (req, res) =>
  userFollowController.followUser(req, res)
);

router.post(USER_FOLLOW_ROUTES.UNFOLLOW, (req, res) =>
  userFollowController.unfollowUser(req, res)
);

router.get(USER_FOLLOW_ROUTES.FOLLOWERS, (req, res) =>
  userFollowController.getFollowers(req, res)
);

router.get(USER_FOLLOW_ROUTES.FOLLOWING, (req, res) =>
  userFollowController.getFollowing(req, res)
);

router.get(USER_FOLLOW_ROUTES.FOLLOW_STATUS, (req, res) =>
  userFollowController.checkFollowStatus(req, res)
);

export default router;
