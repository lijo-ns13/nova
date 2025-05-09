// src/core/interfaces/controllers/IAdminAuthController.ts

import { Request, Response } from "express";

export interface IAdminAuthController {
  signIn(req: Request, res: Response): Promise<void>;
}
