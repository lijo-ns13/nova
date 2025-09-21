import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ITransactionService } from "../../interfaces/services/ITransactionService";
import { handleControllerError } from "../../utils/errorHandler";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { RefundRequestSchema } from "../../core/dtos/user/tranasction/refund.request.dto";
import { ITransactionController } from "../../interfaces/controllers/ITransactionController";

@injectable()
export class TransactionController implements ITransactionController {
  constructor(
    @inject(TYPES.TransactionService)
    private readonly _transactionService: ITransactionService
  ) {}

  async createCheckoutSession(req: Request, res: Response): Promise<void> {
    try {
      const { userId, price, metadata } = req.body;

      const result = await this._transactionService.createCheckoutSession({
        userId,
        price,
        metadata,
      });

      //   res.status(HTTP_STATUS_CODES.OK).json({ success: true, data: result });
      res.status(HTTP_STATUS_CODES.OK).json({ url: result.url });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "TransactionController.createCheckoutSession"
      );
    }
  }
  async confirmPaymentSession(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const result = await this._transactionService.confirmPaymentSession({
        sessionId,
      });

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Subscription activated successfully",
        data: result,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        "TransactionController.confirmPaymentSession"
      );
    }
  }
  async refund(req: Request, res: Response): Promise<void> {
    try {
      const parsed = RefundRequestSchema.parse(req.body);
      const result = await this._transactionService.processRefund(parsed);
      res.status(HTTP_STATUS_CODES.OK).json(result);
    } catch (err) {
      handleControllerError(err, res, "TransactionController.refund");
    }
  }
  async getLatestSession(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const txn = await this._transactionService.getLatestTransactionByUser(
        userId
      );
      res.status(HTTP_STATUS_CODES.OK).json({ success: true, data: txn });
    } catch (err) {
      handleControllerError(err, res, "TransactionController.getLatestSession");
    }
  }
  async getTransactionDetails(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const txnDetails = await this._transactionService.getTransactionDetails(
        sessionId
      );
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, data: txnDetails });
    } catch (err) {
      handleControllerError(
        err,
        res,
        "TransactionController.getTransactionDetails"
      );
    }
  }
}
