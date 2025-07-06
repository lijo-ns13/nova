import { Request, Response } from "express";

export interface ISkillController {
  /**
   * GET /skills?q=... – Search skill titles
   */
  searchSkills(req: Request, res: Response): Promise<void>;
}
