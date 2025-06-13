// controllers/stripeController.ts
import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { IStripeController } from "../interfaces/controllers/IStripeController";
import { IStripeService } from "../interfaces/services/IStripeService";
import { TYPES } from "../di/types";
import { HTTP_STATUS_CODES } from "../core/enums/httpStatusCode";

@injectable()
export class StripeController implements IStripeController {
  constructor(
    @inject(TYPES.StripeService) private stripeService: IStripeService
  ) {}

  async createCheckoutSession(req: Request, res: Response): Promise<void> {
    try {
      const { price, userId, metadata } = req.body;
      const { url } = await this.stripeService.createCheckoutSession(
        price,
        userId,
        metadata
      );
      res.status(HTTP_STATUS_CODES.OK).json({ url });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: error.message || "Failed to create checkout session",
      });
    }
  }

  async handleRefund(req: Request, res: Response): Promise<void> {
    try {
      const { stripeSessionId, reason } = req.body;
      const result = await this.stripeService.handleRefund(
        stripeSessionId,
        reason
      );
      res.status(HTTP_STATUS_CODES.OK).json(result);
    } catch (error: any) {
      console.error("Refund error:", error);
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        message: error.message || "Failed to process refund",
      });
    }
  }

  async getLatestTransactionSession(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const transaction = await this.stripeService.getLatestTransactionSession(
        userId
      );

      if (!transaction) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          message: "No completed transaction found",
        });
        return;
      }

      res.status(HTTP_STATUS_CODES.OK).json({
        stripeSessionId: transaction.stripeSessionId,
        planName: transaction.planName,
        amount: transaction.amount,
        currency: transaction.currency,
        createdAt: transaction.createdAt,
      });
    } catch (error: any) {
      console.error("Transaction error:", error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Failed to fetch transaction",
      });
    }
  }
}
