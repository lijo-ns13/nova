// src/routes/notification.routes.ts
import { Router } from "express";
import { INotificationController } from "../interfaces/controllers/INotificationController";
import { IAuthMiddleware } from "../interfaces/middlewares/IAuthMiddleware";
import { TYPES } from "../di/types";
import container from "../di/container";

const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);
const notificationController = container.get<INotificationController>(
  TYPES.NotificationController
);

const router = Router();
// router.use(authMiddleware.authenticateMultiple(["user", "company"]));
router.use(authMiddleware.authenticate("user"));

router.use(authMiddleware.check());

// router.get("/", (req, res) =>
//   notificationController.getNotifications(req, res)
// );
router.get("/", (req, res, next) =>
  notificationController.getNotifications(req, res).catch(next)
);
router.patch("/:notificationId/read", (req, res) =>
  notificationController.markNotificationAsRead(req, res)
);
router.patch("/read-all", (req, res) =>
  notificationController.markAllNotificationsAsRead(req, res)
);
router.get("/unread-count", (req, res) =>
  notificationController.getUnreadCount(req, res)
);
router.delete("/:notificationId", (req, res) =>
  notificationController.deleteNotification(req, res)
);

export default router;
