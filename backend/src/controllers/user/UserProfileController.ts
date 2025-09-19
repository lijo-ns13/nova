import e, { Request, Response } from "express";
import { TYPES } from "../../di/types";
import { inject, injectable } from "inversify";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { IUserProfileService } from "../../interfaces/services/IUserProfileService";
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
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
import { AuthenticatedUser } from "../../interfaces/request/authenticated.user.interface";

@injectable()
export class UserProfileController implements IUserProfileController {
  constructor(
    @inject(TYPES.UserProfileService)
    private _userProfileService: IUserProfileService,
    @inject(TYPES.MediaService) private _mediaService: IMediaService
  ) {}
  async getUserProfile(req: Request, res: Response) {
    try {
      const userId = (req.user as AuthenticatedUser)?.id;
      const profile = await this._userProfileService.getUserProfile(userId);
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
      const userId = (req.user as AuthenticatedUser)?.id;
      const parsed = UpdateUserProfileInputSchema.parse(req.body);
      const updated = await this._userProfileService.updateUserProfile(
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

  async updateProfileImage(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as AuthenticatedUser)?.id;
      const file = req.file;

      if (!file) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "No file provided",
        });
        return;
      }
      const s3Key = await this._mediaService.uploadSingleMedia(
        file,
        userId,
        "User"
      );
      const signedUrl = await this._userProfileService.updateProfileImage(
        userId,
        s3Key
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "updated successfully",
        data: signedUrl,
      });
    } catch (error) {
      handleControllerError(error, res, "updateProfileImage");
    }
  }

  async deleteProfileImage(req: Request, res: Response) {
    try {
      const userId = (req.user as AuthenticatedUser)?.id;
      await this._userProfileService.deleteProfileImage(userId);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Profile image deleted successfully",
        data: true,
      });
    } catch (error) {
      handleControllerError(error, res, "deleteProfileImage");
    }
  }
  async addEducation(req: Request, res: Response) {
    try {
      const userId = (req.user as AuthenticatedUser)?.id;
      const input = CreateEducationInputSchema.parse(req.body);
      const result = await this._userProfileService.addEducation(userId, input);
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
      const result = await this._userProfileService.editEducation(
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
      const userId = (req.user as AuthenticatedUser)?.id;
      await this._userProfileService.deleteEducation(
        userId,
        req.params.educationId
      );
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Education deleted successfully",
        data: true,
      });
    } catch (error) {
      handleControllerError(error, res, "deleteEducation");
    }
  }

  async getAllEducations(req: Request, res: Response) {
    try {
      const userId = (req.user as AuthenticatedUser)?.id;
      const result = await this._userProfileService.getAllEducations(userId);
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
      const userId = (req.user as AuthenticatedUser)?.id;
      const input = CreateExperienceInputSchema.parse(req.body);
      const experience = await this._userProfileService.addExperience(
        userId,
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
      const updatedExperience = await this._userProfileService.editExperience(
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
      const userId = (req.user as AuthenticatedUser)?.id;
      await this._userProfileService.deleteExperience(
        userId,
        req.params.experienceId
      );
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: "deleted successfully", data: true });
    } catch (error) {
      handleControllerError(error, res, "delete experience");
    }
  }
  async getAllExperiences(req: Request, res: Response) {
    try {
      const userId = (req.user as AuthenticatedUser)?.id;
      const experiences = await this._userProfileService.getAllExperiences(
        userId
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
      const userId = (req.user as AuthenticatedUser)?.id;
      const input = CreateProjectInputSchema.parse(req.body);
      const project = await this._userProfileService.addProject(userId, input);
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
      const updatedProject = await this._userProfileService.editProject(
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
      const userId = (req.user as AuthenticatedUser)?.id;
      await this._userProfileService.deleteProject(
        userId,
        req.params.projectId
      );
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: "deleted successfully", data: true });
    } catch (error) {
      handleControllerError(error, res, "delete project");
    }
  }
  // Get all projects
  async getAllProjects(req: Request, res: Response) {
    try {
      const UserId = (req.user as AuthenticatedUser)?.id;
      const projects = await this._userProfileService.getAllProjects(UserId);

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
      const userId = (req.user as AuthenticatedUser)?.id;
      const input = CreateCertificateInputSchema.parse(req.body);
      const certificate = await this._userProfileService.addCertificate(
        userId,
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
      const updatedCertificate = await this._userProfileService.editCertificate(
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
      const userId = (req.user as AuthenticatedUser)?.id;
      await this._userProfileService.deleteCertificate(
        userId,
        req.params.certificateId
      );
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, message: "deleted successfully", data: true });
    } catch (error) {
      handleControllerError(error, res, "delete certificate");
    }
  }

  // Get all certificates
  async getAllCertificates(req: Request, res: Response) {
    try {
      const userId = (req.user as AuthenticatedUser)?.id;
      const certificates = await this._userProfileService.getAllCertificates(
        userId
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

      const userId = (req.user as AuthenticatedUser)?.id;

      await this._userProfileService.changePassword(
        userId,
        currentPassword,
        newPassword,
        confirmPassword
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Password updated successfully",
        data: true,
      });
    } catch (error) {
      handleControllerError(error, res, "changePassword");
    }
  }
}
