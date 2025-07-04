import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { TYPES } from "../../di/types";
import { inject, injectable } from "inversify";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { Request, RequestHandler, Response } from "express";

import { IAdminSkillController } from "../../interfaces/controllers/IAdminSkillController";
import { IAdminSkillService } from "../../interfaces/services/IAdminSkillService";
interface Userr {
  id: string;
  email: string;
  role: string;
}
@injectable()
export class AdminSkillController implements IAdminSkillController {
  constructor(
    @inject(TYPES.AdminSkillService)
    private _adminSkillService: IAdminSkillService
  ) {}
  async create(req: Request, res: Response) {
    try {
      const adminId = (req.user as Userr)?.id;
      const skill = await this._adminSkillService.create(
        req.body.title,
        adminId
      );
      res.status(HTTP_STATUS_CODES.CREATED).json(skill);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const skill = await this._adminSkillService.update(
        req.params.id,
        req.body
      );
      res.status(HTTP_STATUS_CODES.OK).json(skill);
    } catch (error) {
      // const status = error.message.includes("not found") ? 404 : 400;
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this._adminSkillService.delete(req.params.id);
      res.status(HTTP_STATUS_CODES.OK).send();
    } catch (error) {
      // const status = error.message.includes("not found") ? 404 : 400;
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ error: (error as Error).message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;
      console.log(search, "serach");
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
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: (error as Error).message,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const skill = await this._adminSkillService.getById(req.params.id);
      res.status(HTTP_STATUS_CODES.OK).json(skill);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ error: (error as Error).message });
    }
  }
}
