import { Request, Response } from "express";
import { ITransaction } from "../../models/tranasction.modal";

export interface IStripeController {
  createCheckoutSession(req: Request, res: Response): Promise<void>;
  handleRefund(req: Request, res: Response): Promise<void>;
  getLatestTransactionSession(req: Request, res: Response): Promise<void>;
}
