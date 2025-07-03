import { Request, Response, NextFunction } from "express";

export interface IUserInterviewController {
  updateInterviewStatus(
    req: Request,
    res: Response,
    next?: NextFunction
  ): Promise<void>;
  updateInterviewStatusRescheduled(req: Request, res: Response): Promise<void>;
  getRescheduleSlots(req: Request, res: Response): Promise<void>;
}
