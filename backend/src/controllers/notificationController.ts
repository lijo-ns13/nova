// src/controllers/notificationController.ts
import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { INotificationController } from "../interfaces/controllers/INotificationController";
import { INotificationService } from "../interfaces/services/INotificationService";
import { HTTP_STATUS_CODES } from "../core/enums/httpStatusCode";
import { handleControllerError } from "../utils/errorHandler";
interface UserPayload {
  id: string;
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
      const userId = (req.user as UserPayload)?.id;
      if (!userId) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const limit = Number(req.query.limit) || 20;
      const page = Number(req.query.page) || 1;
      const skip = (page - 1) * limit;

      const { notifications, total } =
        await this.notificationService.getUserNotifications(
          userId,
          limit,
          skip
        );
      const unreadCount = await this.notificationService.getUnreadCount(userId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        data: {
          notifications,
          total,
          unreadCount,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "NotificationController.getNotifications"
      );
    }
  }

  async markNotificationAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as UserPayload)?.id;
      const { notificationId } = req.params;

      if (!userId) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
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
        data: {
          notification,
          unreadCount,
        },
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "NotificationController.markNotificationAsRead"
      );
    }
  }

  async markAllNotificationsAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as UserPayload)?.id;
      if (!userId) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const updatedCount = await this.notificationService.markAllAsRead(userId);
      const unreadCount = await this.notificationService.getUnreadCount(userId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        data: {
          updatedCount,
          unreadCount,
        },
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "NotificationController.markAllNotificationsAsRead"
      );
    }
  }

  async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as UserPayload)?.id;
      if (!userId) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const count = await this.notificationService.getUnreadCount(userId);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        data: { count },
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "NotificationController.getUnreadCount"
      );
    }
  }

  async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as UserPayload)?.id;
      const { notificationId } = req.params;

      if (!userId) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
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
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        data: { unreadCount },
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "NotificationController.deleteNotification"
      );
    }
  }

  async deleteAllNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as UserPayload)?.id;
      if (!userId) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const deletedCount =
        await this.notificationService.deleteAllNotifications(userId);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: `${deletedCount} notifications deleted`,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "NotificationController.deleteAllNotifications"
      );
    }
  }
}
