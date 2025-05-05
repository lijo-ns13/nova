import { IUserRepository } from "../../../../core/interfaces/repositories/IUserRepository";
import { TYPES } from "../../../../di/types";
import { inject, injectable } from "inversify";
import { HTTP_STATUS_CODES } from "../../../../core/enums/httpStatusCode";
import { Request, RequestHandler, Response } from "express";

import { IAdminSkillController } from "../../../../core/interfaces/controllers/IAdminSkillController";
import { IAdminSkillService } from "../../../../core/interfaces/services/IAdminSkillService";

@injectable()
export class AdminSkillController implements IAdminSkillController {
  constructor(
    @inject(TYPES.AdminSkillService)
    private skillService: IAdminSkillService
  ) {}
  async create(req: Request, res: Response) {
    try {
      const skill = await this.skillService.create(req.body.title);
      res.status(HTTP_STATUS_CODES.CREATED).json(skill);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const skill = await this.skillService.update(req.params.id, req.body);
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
      await this.skillService.delete(req.params.id);
      res.status(HTTP_STATUS_CODES.OK).send();
    } catch (error) {
      // const status = error.message.includes("not found") ? 404 : 400;
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ error: (error as Error).message });
    }
  }

  async getAll(_req: Request, res: Response) {
    try {
      const skills = await this.skillService.getAll();
      res.status(HTTP_STATUS_CODES.OK).json(skills);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: (error as Error).message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const skill = await this.skillService.getById(req.params.id);
      res.status(HTTP_STATUS_CODES.OK).json(skill);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ error: (error as Error).message });
    }
  }
}
