// src/controllers/feature.controller.ts
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";

import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { IFeatureController } from "../../interfaces/controllers/IFeatureController";
import { IFeatureService } from "../../interfaces/services/IFeatureService";

@injectable()
export class FeatureController implements IFeatureController {
  constructor(
    @inject(TYPES.FeatureService)
    private _featureService: IFeatureService
  ) {}

  private handleError(error: any, res: Response): void {
    if (error.statusCode === 400 && error.success === false) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        success: false,
        errors: error.errors,
      });
      return;
    }

    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Internal server error",
    });
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const feature = await this._featureService.create(req.body);
      res.status(HTTP_STATUS_CODES.CREATED).json(feature);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const feature = await this._featureService.update(id, req.body);
      if (!feature) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          message: "Feature not found",
        });
        return;
      }
      res.status(HTTP_STATUS_CODES.OK).json(feature);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this._featureService.delete(id);
      if (!success) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          message: "Feature not found",
        });
        return;
      }
      res.status(HTTP_STATUS_CODES.OK).json({
        message: "Feature deleted successfully",
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const features = await this._featureService.getAll();
      res.status(HTTP_STATUS_CODES.OK).json(features);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const feature = await this._featureService.getById(id);
      if (!feature) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          message: "Feature not found",
        });
        return;
      }
      res.status(HTTP_STATUS_CODES.OK).json(feature);
    } catch (error) {
      this.handleError(error, res);
    }
  }
}
