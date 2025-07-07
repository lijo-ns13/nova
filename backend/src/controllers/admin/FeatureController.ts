import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IFeatureController } from "../../interfaces/controllers/IFeatureController";
import { IFeatureService } from "../../interfaces/services/IFeatureService";

import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { handleControllerError } from "../../utils/errorHandler";
import {
  FeatureCreateSchema,
  FeatureUpdateSchema,
} from "../../core/dtos/admin/feature.dto";
import { IdSchema } from "../../core/validations/id.schema";

@injectable()
export class FeatureController implements IFeatureController {
  constructor(
    @inject(TYPES.FeatureService)
    private _featureService: IFeatureService
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const parsed = FeatureCreateSchema.parse(req.body);
      const feature = await this._featureService.create(parsed);
      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: "Feature created successfully",
        data: feature,
      });
    } catch (error) {
      handleControllerError(error, res, "FeatureController.create");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = IdSchema.parse(req.params);
      const parsedBody = FeatureUpdateSchema.parse(req.body);
      const feature = await this._featureService.update(id, parsedBody);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Feature updated successfully",
        data: feature,
      });
    } catch (error) {
      handleControllerError(error, res, "FeatureController.update");
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = IdSchema.parse(req.params);
      await this._featureService.delete(id);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Feature deleted successfully",
      });
    } catch (error) {
      handleControllerError(error, res, "FeatureController.delete");
    }
  }

  async getAll(_: Request, res: Response): Promise<void> {
    try {
      const features = await this._featureService.getAll();
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "succesfully fetched all features",
        data: features,
      });
    } catch (error) {
      handleControllerError(error, res, "FeatureController.getAll");
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = IdSchema.parse(req.params);
      const feature = await this._featureService.getById(id);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "successfully fetch feature",
        data: feature,
      });
    } catch (error) {
      handleControllerError(error, res, "FeatureController.getById");
    }
  }
}
