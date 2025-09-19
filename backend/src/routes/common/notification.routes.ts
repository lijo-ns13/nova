import { Router } from "express";
import { INotificationController } from "../../interfaces/controllers/INotificationController";
import { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";
import { TYPES } from "../../di/types";
import container from "../../di/container";
import { NOTIFICATION_ROUTES } from "../../constants/routes/commonRoutes";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);
const notificationController = container.get<INotificationController>(
  TYPES.NotificationController
);

const router = Router();
router.use(authMiddleware.authenticateMultiple(["user", "company", "admin"]));

router.use(authMiddleware.check());

router.get(NOTIFICATION_ROUTES.ROOT, (req, res, next) =>
  notificationController.getNotifications(req, res).catch(next)
);
router.patch(NOTIFICATION_ROUTES.READ, (req, res) =>
  notificationController.markNotificationAsRead(req, res)
);
router.patch(NOTIFICATION_ROUTES.READ_ALL, (req, res) =>
  notificationController.markAllNotificationsAsRead(req, res)
);
router.get(NOTIFICATION_ROUTES.UNREAD_COUNT, (req, res) =>
  notificationController.getUnreadCount(req, res)
);
router.delete(NOTIFICATION_ROUTES.DELETE_ALL, (req, res) =>
  notificationController.deleteAllNotifications(req, res)
);
router.delete(NOTIFICATION_ROUTES.DELETE, (req, res) =>
  notificationController.deleteNotification(req, res)
);

export default router;
