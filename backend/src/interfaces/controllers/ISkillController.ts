import { Request, Response } from "express";

export interface ISkillController {
  /**
   * GET /skills?q=... – Search skill titles
   */
  searchSkills(req: Request, res: Response): Promise<void>;

  /**
   * POST /skills – Add skill to user
   */
  addSkill(req: Request, res: Response): Promise<void>;

  /**
   * DELETE /skills – Remove skill from user
   */
  removeSkill(req: Request, res: Response): Promise<void>;
  getUserSkills(req: Request, res: Response): Promise<void>;
}
