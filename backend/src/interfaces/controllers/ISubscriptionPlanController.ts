// src/interfaces/controllers/ISubscriptionPlanController.ts
import { Request, Response } from "express";

export interface ISubscriptionPlanController {
  createPlan(req: Request, res: Response): Promise<void>;
  updatePlan(req: Request, res: Response): Promise<void>;
  deletePlan(req: Request, res: Response): Promise<void>;
  getAllPlans(req: Request, res: Response): Promise<void>;
  getPlanById(req: Request, res: Response): Promise<void>;
  togglePlanStatus(req: Request, res: Response): Promise<void>;
}
