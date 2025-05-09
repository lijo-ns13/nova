import { Request, Response } from "express";

export interface ICompanyAuthController {
  signUp(req: Request, res: Response): Promise<void>;
  signIn(req: Request, res: Response): Promise<void>;
  verify(req: Request, res: Response): Promise<void>;
  resend(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
}
