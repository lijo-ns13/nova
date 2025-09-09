// src/interfaces/controllers/IFeatureController.ts
import { Request, Response } from "express";

export interface IFeatureController {
  createFeature(req: Request, res: Response): Promise<void>;
  updateFeature(req: Request, res: Response): Promise<void>;
  deleteFeature(req: Request, res: Response): Promise<void>;
  getAllFeature(req: Request, res: Response): Promise<void>;
  getByIdFeature(req: Request, res: Response): Promise<void>;
}
