// src/controllers/notificationController.ts
import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { INotificationController } from "../interfaces/controllers/INotificationController";
import { INotificationService } from "../interfaces/services/INotificationService";
import { HTTP_STATUS_CODES } from "../core/enums/httpStatusCode";
interface Userr {
  _id: string;
  email: string;
  role: string;
}
@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService
  ) {}

  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as Userr)?._id;
      if (!userId) {
        res
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: "Unauthorized" });
        return;
      }

      const { limit = 20, page = 1 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const { notifications, total } =
        await this.notificationService.getUserNotifications(
          userId,
          Number(limit),
          skip
        );

      const unreadCount = await this.notificationService.getUnreadCount(userId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        data: {
          notifications,
          total,
          unreadCount,
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error("Error getting notifications:", error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async markNotificationAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { notificationId } = req.params;
      const userId = (req.user as Userr)?._id;
      if (!userId) {
        res
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: "Unauthorized" });
        return;
      }

      const notification = await this.notificationService.markAsRead(
        notificationId
      );
      if (!notification) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "Notification not found",
        });
        return;
      }

      const unreadCount = await this.notificationService.getUnreadCount(userId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        notification,
        unreadCount,
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async markAllNotificationsAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as Userr)?._id;
      if (!userId) {
        res
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: "Unauthorized" });
        return;
      }

      const updatedCount = await this.notificationService.markAllAsRead(userId);
      const unreadCount = await this.notificationService.getUnreadCount(userId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        updatedCount,
        unreadCount,
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as Userr)?._id;
      if (!userId) {
        res
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: "Unauthorized" });
        return;
      }

      const count = await this.notificationService.getUnreadCount(userId);
      res.status(HTTP_STATUS_CODES.OK).json({ success: true, count });
    } catch (error) {
      console.error("Error getting unread count:", error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const { notificationId } = req.params;
      const userId = (req.user as Userr)?._id;
      if (!userId) {
        res
          .status(HTTP_STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: "Unauthorized" });
        return;
      }

      const success = await this.notificationService.deleteNotification(
        notificationId,
        userId
      );
      if (!success) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          success: false,
          message: "Notification not found",
        });
        return;
      }

      const unreadCount = await this.notificationService.getUnreadCount(userId);

      res.status(HTTP_STATUS_CODES.OK).json({ success: true, unreadCount });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
