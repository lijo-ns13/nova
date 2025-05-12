// src/interfaces/controllers/ICompanyProfileController.ts
import { Request, Response, NextFunction } from "express";

export interface ICompanyProfileController {
  getCompanyProfile(req: Request, res: Response): Promise<void>;
  getCompanyProfileWithDetails(req: Request, res: Response): Promise<void>;
  updateCompanyProfile(req: Request, res: Response): Promise<void>;
  updateProfileImage(req: Request, res: Response): Promise<void>;
  deleteProfileImage(req: Request, res: Response): Promise<void>;
  changePassword(req: Request, res: Response): Promise<void>;
}
