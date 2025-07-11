import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAdminSkillController } from "../../interfaces/controllers/IAdminSkillController";
import { IAdminSkillService } from "../../interfaces/services/IAdminSkillService";
import {
  CreateSkillSchema,
  UpdateSkillSchema,
} from "../../core/validations/admin/admin.skill.validator";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { handleControllerError } from "../../utils/errorHandler";
import { TYPES } from "../../di/types";

@injectable()
export class AdminSkillController implements IAdminSkillController {
  constructor(
    @inject(TYPES.AdminSkillService)
    private _adminSkillService: IAdminSkillService
  ) {}

  create = async (req: Request, res: Response) => {
    try {
      const { title } = CreateSkillSchema.parse(req.body);
      const adminId = (req.user as { id: string }).id;

      const skillDto = await this._adminSkillService.create({ title }, adminId);

      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: "Skill created successfully",
        data: skillDto,
      });
    } catch (error) {
      handleControllerError(error, res, "AdminSkillController.create");
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const data = UpdateSkillSchema.parse(req.body);

      const updatedDto = await this._adminSkillService.update(id, data);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Skill updated successfully",
        data: updatedDto,
      });
    } catch (error) {
      handleControllerError(error, res, "AdminSkillController.update");
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      await this._adminSkillService.delete(id);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Skill deleted successfully",
      });
    } catch (error) {
      handleControllerError(error, res, "AdminSkillController.delete");
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;

      const result = await this._adminSkillService.getAll(page, limit, search);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        data: result.skills,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      handleControllerError(error, res, "AdminSkillController.getAll");
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const skillDto = await this._adminSkillService.getById(id);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        data: skillDto,
      });
    } catch (error) {
      handleControllerError(error, res, "AdminSkillController.getById");
    }
  };
}
