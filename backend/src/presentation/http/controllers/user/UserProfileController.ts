import { Request, Response } from "express";
import { TYPES } from "../../../../di/types";
import { inject, injectable } from "inversify";
import { HTTP_STATUS_CODES } from "../../../../core/enums/httpStatusCode";
import { IUserProfileService } from "../../../../core/interfaces/services/IUserProfileService";
import { IUserEducation } from "../../../../infrastructure/database/models/userEducation.model";
import { IUserExperience } from "../../../../infrastructure/database/models/userExperience.model";
import { IUserProject } from "../../../../infrastructure/database/models/userProject.model";
import { IUserCertificate } from "../../../../infrastructure/database/models/userCertificate.model";
import { IUserProfileController } from "../../../../core/interfaces/controllers/IUserProfileController";

interface Userr {
  id: string;
  email: string;
  role: string;
}

@injectable()
export class UserProfileController implements IUserProfileController {
  constructor(
    @inject(TYPES.UserProfileService)
    private userProfileService: IUserProfileService
  ) {}
  async getUserProfile(req: Request, res: Response) {
    try {
      const user = await this.userProfileService.getUserProfile(
        req.params.userId
      );
      res.status(HTTP_STATUS_CODES.OK).json(user);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }

  async updateUserProfile(req: Request, res: Response) {
    try {
      const updatedUser = await this.userProfileService.updateUserProfile(
        req.params.userId,
        req.body
      );
      res.status(HTTP_STATUS_CODES.OK).json(updatedUser);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }

  async updateProfileImage(req: Request, res: Response) {
    try {
      const updated = await this.userProfileService.updateProfileImage(
        req.params.userId,
        req.body.imageUrl
      );
      res.status(HTTP_STATUS_CODES.OK).json(updated);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }

  async deleteProfileImage(req: Request, res: Response) {
    try {
      await this.userProfileService.deleteProfileImage(req.params.userId);
      res.status(HTTP_STATUS_CODES.OK).send();
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }

  async addEducation(req: Request, res: Response) {
    try {
      const education = await this.userProfileService.addEducation(
        req.params.userId,
        req.body as IUserEducation
      );
      res.status(HTTP_STATUS_CODES.CREATED).json(education);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }
  async editEducation(req: Request, res: Response) {
    try {
      const updatedEducation = await this.userProfileService.editEducation(
        req.params.educationId,
        req.body as Partial<IUserEducation>
      );
      res.status(HTTP_STATUS_CODES.OK).json(updatedEducation);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }
  async deleteEducation(req: Request, res: Response) {
    try {
      await this.userProfileService.deleteEducation(
        req.params.userId,
        req.params.educationId
      );
      res.status(HTTP_STATUS_CODES.OK).send();
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }

  async addExperience(req: Request, res: Response) {
    try {
      const experience = await this.userProfileService.addExperience(
        req.params.userId,
        req.body as IUserExperience
      );
      res.status(HTTP_STATUS_CODES.CREATED).json(experience);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }
  async editExperience(req: Request, res: Response) {
    try {
      const updatedExperience = await this.userProfileService.editExperience(
        req.params.experienceId, // Corrected to use experienceId from params
        req.body as Partial<IUserExperience>
      );
      res.status(HTTP_STATUS_CODES.OK).json(updatedExperience);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }
  async deleteExperience(req: Request, res: Response) {
    try {
      await this.userProfileService.deleteExperience(
        req.params.userId,
        req.params.experienceId
      );
      res.status(HTTP_STATUS_CODES.OK).send();
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }

  async addProject(req: Request, res: Response) {
    try {
      const project = await this.userProfileService.addProject(
        req.params.userId,
        req.body as IUserProject
      );
      res.status(HTTP_STATUS_CODES.CREATED).json(project);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }
  async editProject(req: Request, res: Response) {
    try {
      const updatedProject = await this.userProfileService.editProject(
        req.params.projectId,
        req.body as Partial<IUserProject>
      );
      res.status(HTTP_STATUS_CODES.OK).json(updatedProject);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }
  async deleteProject(req: Request, res: Response) {
    try {
      await this.userProfileService.deleteProject(
        req.params.userId,
        req.params.projectId
      );
      res.status(HTTP_STATUS_CODES.OK).send();
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }

  async addCertificate(req: Request, res: Response) {
    try {
      const certificate = await this.userProfileService.addCertificate(
        req.params.userId,
        req.body as IUserCertificate
      );
      res.status(HTTP_STATUS_CODES.CREATED).json(certificate);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }
  async editCertificate(req: Request, res: Response) {
    try {
      const updatedCertificate = await this.userProfileService.editCertificate(
        req.params.certificateId,
        req.body as Partial<IUserCertificate>
      );
      res.json(updatedCertificate);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }
  async deleteCertificate(req: Request, res: Response) {
    try {
      await this.userProfileService.deleteCertificate(
        req.params.userId,
        req.params.certificateId
      );
      res.status(HTTP_STATUS_CODES.OK).send();
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }
  // Get all educations
  async getAllEducations(req: Request, res: Response) {
    try {
      const educations = await this.userProfileService.getAllEducations(
        req.params.userId
      );
      res.status(HTTP_STATUS_CODES.OK).json(educations);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }

  // Get all experiences
  async getAllExperiences(req: Request, res: Response) {
    try {
      const experiences = await this.userProfileService.getAllExperiences(
        req.params.userId
      );
      res.status(HTTP_STATUS_CODES.OK).json(experiences);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }

  // Get all projects
  async getAllProjects(req: Request, res: Response) {
    try {
      const projects = await this.userProfileService.getAllProjects(
        req.params.userId
      );
      res.status(HTTP_STATUS_CODES.OK).json(projects);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }

  // Get all certificates
  async getAllCertificates(req: Request, res: Response) {
    try {
      const certificates = await this.userProfileService.getAllCertificates(
        req.params.userId
      );
      res.status(HTTP_STATUS_CODES.OK).json(certificates);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }
  async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      if (!currentPassword || !newPassword || !confirmPassword) {
        res.status(400).json({ message: "Please provide all fields" });
        return;
      }
      console.log("req.body", req.body);
      await this.userProfileService.changePassword(
        (req.user as Userr)?.id,
        currentPassword,
        newPassword,
        confirmPassword
      );
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ message: "Password updated successfully" });
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }
}
