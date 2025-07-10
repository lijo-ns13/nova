import e, { Request, Response } from "express";
import { TYPES } from "../../di/types";
import { inject, injectable } from "inversify";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { IUserProfileService } from "../../interfaces/services/IUserProfileService";
import { IUserEducation } from "../../models/userEducation.model";
import { IUserExperience } from "../../models/userExperience.model";
import { IUserProject } from "../../models/userProject.model";
import { IUserCertificate } from "../../models/userCertificate.model";
import { IUserProfileController } from "../../interfaces/controllers/IUserProfileController";
import { handleControllerError } from "../../utils/errorHandler";
import {
  UpdateProfileImageSchema,
  UpdateUserProfileInputSchema,
} from "../../core/dtos/user/userprofile";
import {
  CreateEducationInputSchema,
  UpdateEducationInputSchema,
} from "../../core/validations/user/usereducation";
import {
  CreateExperienceInputSchema,
  UpdateExperienceInputSchema,
} from "../../core/validations/user/userexperience";
import {
  ChangePasswordSchema,
  CreateProjectInputSchema,
  UpdateProjectInputSchema,
} from "../../core/validations/user/user.projectschema";
import {
  CreateCertificateInputSchema,
  UpdateCertificateInputSchema,
} from "../../core/validations/user/usercertificate.schema";

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
      const userId = req.params.userId;
      const profile = await this.userProfileService.getUserProfile(userId);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "User profile fetched successfully",
        data: profile,
      });
    } catch (error) {
      handleControllerError(error, res, "getUserProfile");
    }
  }

  async updateUserProfile(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const parsed = UpdateUserProfileInputSchema.parse(req.body);
      const updated = await this.userProfileService.updateUserProfile(
        userId,
        parsed
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "User profile updated successfully",
        data: updated,
      });
    } catch (error) {
      handleControllerError(error, res, "updateUserProfile");
    }
  }

  async updateProfileImage(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const { imageUrl } = UpdateProfileImageSchema.parse(req.body);
      const updated = await this.userProfileService.updateProfileImage(
        userId,
        imageUrl
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Profile image updated successfully",
        data: updated,
      });
    } catch (error) {
      handleControllerError(error, res, "updateProfileImage");
    }
  }

  async deleteProfileImage(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      await this.userProfileService.deleteProfileImage(userId);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Profile image deleted successfully",
      });
    } catch (error) {
      handleControllerError(error, res, "deleteProfileImage");
    }
  }
  async addEducation(req: Request, res: Response) {
    try {
      const input = CreateEducationInputSchema.parse(req.body);
      const result = await this.userProfileService.addEducation(
        req.params.userId,
        input
      );
      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: "Education added successfully",
        data: result,
      });
    } catch (error) {
      handleControllerError(error, res, "addEducation");
    }
  }

  async editEducation(req: Request, res: Response) {
    try {
      const data = UpdateEducationInputSchema.parse(req.body);
      const result = await this.userProfileService.editEducation(
        req.params.educationId,
        data
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Education updated successfully",
        data: result,
      });
    } catch (error) {
      handleControllerError(error, res, "editEducation");
    }
  }

  async deleteEducation(req: Request, res: Response) {
    try {
      await this.userProfileService.deleteEducation(
        req.params.userId,
        req.params.educationId
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Education deleted successfully",
      });
    } catch (error) {
      handleControllerError(error, res, "deleteEducation");
    }
  }

  async getAllEducations(req: Request, res: Response) {
    try {
      const result = await this.userProfileService.getAllEducations(
        req.params.userId
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Educations fetched successfully",
        data: result,
      });
    } catch (error) {
      handleControllerError(error, res, "getAllEducations");
    }
  }
  // exp
  async addExperience(req: Request, res: Response) {
    try {
      const input = CreateExperienceInputSchema.parse(req.body);
      const experience = await this.userProfileService.addExperience(
        req.params.userId,
        input
      );
      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: "added exp successfully",
        data: experience,
      });
    } catch (error) {
      handleControllerError(error, res, "addexperience");
    }
  }
  async editExperience(req: Request, res: Response) {
    try {
      const updated = UpdateExperienceInputSchema.parse(req.body);
      const updatedExperience = await this.userProfileService.editExperience(
        req.params.experienceId,
        updated
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "edit exp successfully",
        data: updatedExperience,
      });
    } catch (error) {
      handleControllerError(error, res, "editExperince");
    }
  }
  async deleteExperience(req: Request, res: Response) {
    try {
      await this.userProfileService.deleteExperience(
        req.params.userId,
        req.params.experienceId
      );
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: "deleted successfully" });
    } catch (error) {
      handleControllerError(error, res, "delete experience");
    }
  }
  async getAllExperiences(req: Request, res: Response) {
    try {
      const experiences = await this.userProfileService.getAllExperiences(
        req.params.userId
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "fetch exp successfully",
        data: experiences,
      });
    } catch (error) {
      handleControllerError(error, res, "getallexperience");
    }
  }
  async addProject(req: Request, res: Response) {
    try {
      const input = CreateProjectInputSchema.parse(req.body);
      const project = await this.userProfileService.addProject(
        req.params.userId,
        input
      );
      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: "added project successfully",
        data: project,
      });
    } catch (error) {
      handleControllerError(error, res, "addproject");
    }
  }
  async editProject(req: Request, res: Response) {
    try {
      const updated = UpdateProjectInputSchema.parse(req.body);
      const updatedProject = await this.userProfileService.editProject(
        req.params.projectId,
        updated
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "edit successfully project",
        data: updatedProject,
      });
    } catch (error) {
      handleControllerError(error, res, "editproject");
    }
  }
  async deleteProject(req: Request, res: Response) {
    try {
      await this.userProfileService.deleteProject(
        req.params.userId,
        req.params.projectId
      );
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: "deleted successfully" });
    } catch (error) {
      handleControllerError(error, res, "delete project");
    }
  }
  // Get all projects
  async getAllProjects(req: Request, res: Response) {
    try {
      const projects = await this.userProfileService.getAllProjects(
        req.params.userId
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "fetch projects successfully",
        data: projects,
      });
    } catch (error) {
      handleControllerError(error, res, "getallprojects");
    }
  }
  async addCertificate(req: Request, res: Response) {
    try {
      const input = CreateCertificateInputSchema.parse(req.body);
      const certificate = await this.userProfileService.addCertificate(
        req.params.userId,
        input
      );
      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: "added successfully certificate",
        data: certificate,
      });
    } catch (error) {
      handleControllerError(error, res, "add certificate");
    }
  }
  async editCertificate(req: Request, res: Response) {
    try {
      const updated = UpdateCertificateInputSchema.parse(req.body);
      const updatedCertificate = await this.userProfileService.editCertificate(
        req.params.certificateId,
        updated
      );
      res.json({
        success: true,
        message: "updated successfully certifcate",
        data: updatedCertificate,
      });
    } catch (error) {
      handleControllerError(error, res, "editcertificate");
    }
  }
  async deleteCertificate(req: Request, res: Response) {
    try {
      await this.userProfileService.deleteCertificate(
        req.params.userId,
        req.params.certificateId
      );
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: "deleted successfully" });
    } catch (error) {
      handleControllerError(error, res, "delete certificate");
    }
  }

  // Get all certificates
  async getAllCertificates(req: Request, res: Response) {
    try {
      const certificates = await this.userProfileService.getAllCertificates(
        req.params.userId
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "successfully fetched cert",
        data: certificates,
      });
    } catch (error) {
      handleControllerError(error, res, "getallcertificates");
    }
  }
  async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword, confirmPassword } =
        ChangePasswordSchema.parse(req.body);

      const userId = (req.user as Userr)?.id;

      await this.userProfileService.changePassword(
        userId,
        currentPassword,
        newPassword,
        confirmPassword
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      handleControllerError(error, res, "changePassword");
    }
  }
}
