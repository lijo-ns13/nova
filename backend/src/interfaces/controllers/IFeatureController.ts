// src/interfaces/controllers/IFeatureController.ts
import { Request, Response } from "express";

export interface IFeatureController {
  create(req: Request, res: Response): Promise<void>;
  update(req: Request, res: Response): Promise<void>;
  delete(req: Request, res: Response): Promise<void>;
  getAll(req: Request, res: Response): Promise<void>;
  getById(req: Request, res: Response): Promise<void>;
}
