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
import {
  ADMIN_CONTROLLER_ERROR,
  ADMIN_MESSAGES,
} from "../../constants/message.constants";
import { SkillMapper } from "../../mapping/admin/admin.skill.mapper";

@injectable()
export class AdminSkillController implements IAdminSkillController {
  constructor(
    @inject(TYPES.AdminSkillService)
    private readonly _adminSkillService: IAdminSkillService
  ) {}

  createSkill = async (req: Request, res: Response) => {
    try {
      const { title } = CreateSkillSchema.parse(req.body);
      const entity = SkillMapper.fromBaseDTO(title);
      const adminId = (req.user as { id: string }).id;

      const skillDto = await this._adminSkillService.create(entity, adminId);

      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: ADMIN_MESSAGES.SKILL.CREATED,
        data: skillDto,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        ADMIN_CONTROLLER_ERROR.CREATE_SKILL_ERROR
      );
    }
  };

  updateSkill = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const entity = SkillMapper.idFromDTO({ id });
      const data = UpdateSkillSchema.parse(entity.id);

      const updatedDto = await this._adminSkillService.update(id, data);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.SKILL.UPDATED,
        data: updatedDto,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        ADMIN_CONTROLLER_ERROR.UPDATE_SKILL_ERROR
      );
    }
  };

  deleteSkill = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const entity = SkillMapper.idFromDTO({ id });
      await this._adminSkillService.delete(entity.id);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: ADMIN_MESSAGES.SKILL.DELETED,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        ADMIN_CONTROLLER_ERROR.DELETE_SKILL_ERROR
      );
    }
  };

  getAllSkill = async (req: Request, res: Response) => {
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
      handleControllerError(
        error,
        res,
        ADMIN_CONTROLLER_ERROR.GETALL_SKILL_ERROR
      );
    }
  };

  getByIdSkill = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const entity = SkillMapper.idFromDTO({ id });

      const skillDto = await this._adminSkillService.getById(entity.id);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        data: skillDto,
      });
    } catch (error) {
      handleControllerError(
        error,
        res,
        ADMIN_CONTROLLER_ERROR.GETBYID_SKILL_ERROR
      );
    }
  };
}
