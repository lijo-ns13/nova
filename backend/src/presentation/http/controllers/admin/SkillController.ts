import { IUserRepository } from "../../../../core/interfaces/repositories/IUserRepository";
import { TYPES } from "../../../../di/types";
import { inject, injectable } from "inversify";
import { HTTP_STATUS_CODES } from "../../../../core/enums/httpStatusCode";
import { Request, RequestHandler, Response } from "express";

import { ISkillService } from "../../../../core/interfaces/services/ISkillService";
import { ISkillController } from "../../../../core/interfaces/controllers/ISkillController";
@injectable()
export class SkillController implements ISkillController {
  constructor(
    @inject(TYPES.SkillService)
    private skillService: ISkillService
  ) {}
  async create(req: Request, res: Response) {
    try {
      const skill = await this.skillService.create(req.body.title);
      res.status(HTTP_STATUS_CODES.CREATED).json(skill);
    } catch (error: any) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const skill = await this.skillService.update(req.params.id, req.body);
      res.status(HTTP_STATUS_CODES.OK).json(skill);
    } catch (error: any) {
      // const status = error.message.includes("not found") ? 404 : 400;
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.skillService.delete(req.params.id);
      res.status(HTTP_STATUS_CODES.OK).send();
    } catch (error: any) {
      // const status = error.message.includes("not found") ? 404 : 400;
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  }

  async getAll(_req: Request, res: Response) {
    try {
      const skills = await this.skillService.getAll();
      res.status(HTTP_STATUS_CODES.OK).json(skills);
    } catch (error: any) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const skill = await this.skillService.getById(req.params.id);
      res.status(HTTP_STATUS_CODES.OK).json(skill);
    } catch (error: any) {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
    }
  }
}
