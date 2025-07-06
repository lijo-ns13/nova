import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserSkillService } from "../../interfaces/services/IUserSkillService";
import {
  AddUserSkillSchema,
  RemoveUserSkillSchema,
} from "../../dtos/request/user.skill.request.dto";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { handleControllerError } from "../../utils/errorHandler";

interface UserPayload {
  id: string;
  email: string;
  role: string;
}

@injectable()
export class UserSkillController {
  constructor(
    @inject(TYPES.UserSkillService)
    private _skillService: IUserSkillService
  ) {}

  async addSkill(req: Request, res: Response): Promise<void> {
    try {
      const { title } = AddUserSkillSchema.parse(req.body);
      const userId = (req.user as UserPayload)?.id;
      const result = await this._skillService.addSkillToUser(userId, title);
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({
          success: true,
          message: "Skill added successfully",
          data: result,
        });
    } catch (err) {
      handleControllerError(err, res, "UserSkillController::addSkill");
    }
  }

  async removeSkill(req: Request, res: Response): Promise<void> {
    try {
      const { skillId } = RemoveUserSkillSchema.parse(req.params);
      const userId = (req.user as UserPayload)?.id;
      await this._skillService.deleteSkillFromUser(userId, skillId);
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: "Skill removed" });
    } catch (err) {
      handleControllerError(err, res, "UserSkillController::removeSkill");
    }
  }

  async getUserSkills(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as UserPayload)?.id;
      const skills = await this._skillService.getUserSkills(userId);
      res.status(HTTP_STATUS_CODES.OK).json({ success: true, data: skills });
    } catch (err) {
      handleControllerError(err, res, "UserSkillController::getUserSkills");
    }
  }
}
