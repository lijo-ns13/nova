import { Types } from "mongoose";
import { IUserExperience } from "../../models/userExperience.model";
import {
  CreateExperienceInputDTO,
  ExperienceResponseDTO,
} from "../../core/dtos/user/userExperience";

export class ExperienceMapper {
  static toDTO(doc: IUserExperience): ExperienceResponseDTO {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      title: doc.title,
      company: doc.company,
      description: doc.description,
      location: doc.location,
      startDate: doc.startDate.toString(),
      endDate: doc.endDate?.toString(),
    };
  }
}
