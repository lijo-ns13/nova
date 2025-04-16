import { Request, Response } from "express";

export interface IAuthController {
  signUp(req: Request, res: Response): Promise<void>;
  signIn(req: Request, res: Response): Promise<void>;
  verifyOTP(req: Request, res: Response): Promise<void>;
  resendOTP(req: Request, res: Response): Promise<void>;
  forgetPassword(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
}
