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
import { FeatureMapper } from "../../mapping/admin/admin.feature.mapper";

@injectable()
export class FeatureController implements IFeatureController {
  constructor(
    @inject(TYPES.FeatureService)
    private readonly _featureService: IFeatureService
  ) {}

  async createFeature(req: Request, res: Response): Promise<void> {
    try {
      const parsed = FeatureCreateSchema.parse(req.body);
      const entity = FeatureMapper.fromDTO(parsed);
      const feature = await this._featureService.create(entity);
      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: ADMIN_MESSAGES.FEATURE.CREATED,
        data: feature,
      });
    } catch (error) {
      handleControllerError(error, res, ADMIN_CONTROLLER_ERROR.CREATE_FEATURE);
    }
  }

  async updateFeature(req: Request, res: Response): Promise<void> {
    try {
      const { id } = IdSchema.parse(req.params);
      const parsedBody = FeatureUpdateSchema.parse(req.body);
      const entity = FeatureMapper.fromDTO(parsedBody);
      const feature = await this._featureService.update(id, entity);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.FEATURE.UPDATED,
        data: feature,
      });
    } catch (error) {
      handleControllerError(error, res, ADMIN_CONTROLLER_ERROR.UPDATE_FEATURE);
    }
  }

  async deleteFeature(req: Request, res: Response): Promise<void> {
    try {
      const { id } = IdSchema.parse(req.params);
      const entity = FeatureMapper.formIdDTO(id);
      await this._featureService.delete(entity.id);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.FEATURE.DELETED,
      });
    } catch (error) {
      handleControllerError(error, res, ADMIN_CONTROLLER_ERROR.DELETE_FEATURE);
    }
  }

  async getAllFeature(_: Request, res: Response): Promise<void> {
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

  async getByIdFeature(req: Request, res: Response): Promise<void> {
    try {
      const { id } = IdSchema.parse(req.params);
      const entity = FeatureMapper.formIdDTO(id);
      const feature = await this._featureService.getById(entity.id);
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
