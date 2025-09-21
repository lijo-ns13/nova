import { Request, Response } from "express";

export interface ITransactionController {
  createCheckoutSession(req: Request, res: Response): Promise<void>;
  confirmPaymentSession(req: Request, res: Response): Promise<void>;
  refund(req: Request, res: Response): Promise<void>;
  getLatestSession(req: Request, res: Response): Promise<void>;
  getTransactionDetails(req: Request, res: Response): Promise<void>;
}
