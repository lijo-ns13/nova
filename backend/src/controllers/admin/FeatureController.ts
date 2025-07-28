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
import {
  ADMIN_CONTROLLER_ERROR,
  ADMIN_MESSAGES,
} from "../../constants/message.constants";

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
        message: ADMIN_MESSAGES.FEATURE.CREATED,
        data: feature,
      });
    } catch (error) {
      handleControllerError(error, res, ADMIN_CONTROLLER_ERROR.CREATE_FEATURE);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = IdSchema.parse(req.params);
      const parsedBody = FeatureUpdateSchema.parse(req.body);
      const feature = await this._featureService.update(id, parsedBody);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.FEATURE.UPDATED,
        data: feature,
      });
    } catch (error) {
      handleControllerError(error, res, ADMIN_CONTROLLER_ERROR.UPDATE_FEATURE);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = IdSchema.parse(req.params);
      await this._featureService.delete(id);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.FEATURE.DELETED,
      });
    } catch (error) {
      handleControllerError(error, res, ADMIN_CONTROLLER_ERROR.DELETE_FEATURE);
    }
  }

  async getAll(_: Request, res: Response): Promise<void> {
    try {
      const features = await this._featureService.getAll();
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.FEATURE.FETCH_ALL,
        data: features,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        ADMIN_CONTROLLER_ERROR.FETCHALL_FEATURE
      );
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = IdSchema.parse(req.params);
      const feature = await this._featureService.getById(id);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.FEATURE.FETCH_BYID,
        data: feature,
      });
    } catch (error) {
      handleControllerError(error, res, ADMIN_CONTROLLER_ERROR.FETCH_FEATURE);
    }
  }
}
