import { Request, Response } from "express";

export interface IStripeController {
  createCheckoutSession(req: Request, res: Response): Promise<void>;
  handleRefund(req: Request, res: Response): Promise<void>;
  getLatestTransactionSession(req: Request, res: Response): Promise<void>;
}
