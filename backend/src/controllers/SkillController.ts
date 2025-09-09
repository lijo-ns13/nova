import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { ISkillService } from "../interfaces/services/ISkillService";
import { ISkillController } from "../interfaces/controllers/ISkillController";
import { HTTP_STATUS_CODES } from "../core/enums/httpStatusCode";
import { SkillSearchRequestSchema } from "../dtos/request/skill.request.dto";
import { handleControllerError } from "../utils/errorHandler";

@injectable()
export class SkillController implements ISkillController {
  constructor(
    @inject(TYPES.SkillService) private _skillService: ISkillService
  ) {}

  async searchSkills(req: Request, res: Response): Promise<void> {
    try {
      const parsedQuery = SkillSearchRequestSchema.parse(req.query);
      const result = await this._skillService.searchSkills(parsedQuery.q);
      res.status(HTTP_STATUS_CODES.OK).json({ success: true, data: result });
    } catch (error) {
      handleControllerError(error, res, "SkillController::search");
    }
  }
}
