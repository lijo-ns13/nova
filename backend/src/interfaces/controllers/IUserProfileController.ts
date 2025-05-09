import { Request, Response } from "express";

export interface IUserProfileController {
  getUserProfile(req: Request, res: Response): Promise<void>;
  updateUserProfile(req: Request, res: Response): Promise<void>;
  updateProfileImage(req: Request, res: Response): Promise<void>;
  deleteProfileImage(req: Request, res: Response): Promise<void>;

  addEducation(req: Request, res: Response): Promise<void>;
  editEducation(req: Request, res: Response): Promise<void>;
  deleteEducation(req: Request, res: Response): Promise<void>;
  getAllEducations(req: Request, res: Response): Promise<void>;

  addExperience(req: Request, res: Response): Promise<void>;
  editExperience(req: Request, res: Response): Promise<void>;
  deleteExperience(req: Request, res: Response): Promise<void>;
  getAllExperiences(req: Request, res: Response): Promise<void>;

  addProject(req: Request, res: Response): Promise<void>;
  editProject(req: Request, res: Response): Promise<void>;
  deleteProject(req: Request, res: Response): Promise<void>;
  getAllProjects(req: Request, res: Response): Promise<void>;

  addCertificate(req: Request, res: Response): Promise<void>;
  editCertificate(req: Request, res: Response): Promise<void>;
  deleteCertificate(req: Request, res: Response): Promise<void>;
  getAllCertificates(req: Request, res: Response): Promise<void>;

  changePassword(req: Request, res: Response): Promise<void>;
}
