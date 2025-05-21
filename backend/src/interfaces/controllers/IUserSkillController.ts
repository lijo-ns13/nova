import { Request, Response } from "express";

export interface IUserSkillController {
  getUserSkills(req: Request, res: Response): Promise<void>;
  addSkills(req: Request, res: Response): Promise<void>;
  deleteSkill(req: Request, res: Response): Promise<void>;
}
