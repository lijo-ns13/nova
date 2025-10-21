// interfaces/controllers/IUserGoogleController.ts
import { NextFunction, Request, Response } from "express";

export interface IUserGoogleController {
  /**
   * Redirects the user to Google OAuth login page.
   */
  redirectToGoogle(req: Request, res: Response): void;

  /**
   * Handles the Google OAuth callback.
   * Sets access and refresh tokens as cookies and redirects to frontend.
   */
  handleGoogleCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  refreshAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  refreshUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}
