import { Request, Response } from "express";

export interface ISkillController {
  searchSkills(req: Request, res: Response): Promise<void>;
}
