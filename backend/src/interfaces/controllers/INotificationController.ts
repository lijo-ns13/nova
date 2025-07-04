// src/interfaces/controllers/INotificationController.ts
import { Request, Response } from "express";

export interface INotificationController {
  getNotifications(req: Request, res: Response): Promise<void>;
  markNotificationAsRead(req: Request, res: Response): Promise<void>;
  markAllNotificationsAsRead(req: Request, res: Response): Promise<void>;
  getUnreadCount(req: Request, res: Response): Promise<void>;
  deleteNotification(req: Request, res: Response): Promise<void>;
  deleteAllNotifications(req: Request, res: Response): Promise<void>;
}
