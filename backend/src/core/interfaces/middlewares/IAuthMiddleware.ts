// src/interfaces/middlewares/IAuthMiddleware.ts
import { Request, Response, NextFunction } from "express";

export interface IAuthMiddleware {
  authenticate(
    role: "user" | "admin" | "company"
  ): (req: Request, res: Response, next: NextFunction) => Promise<void>;
  authenticateMultiple(
    roles: ("user" | "admin" | "company")[]
  ): (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
