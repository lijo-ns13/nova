import { EducationResponseDTO } from "../../core/dtos/user/UserEducation.dto";
import { IUserEducation } from "../../repositories/entities/education.entity";

export class EducationMapper {
  static toDTO(edu: IUserEducation): EducationResponseDTO {
    return {
      id: edu._id.toString(),
      userId: edu.userId.toString(),
      institutionName: edu.institutionName,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      grade: edu.grade,
      startDate: edu.startDate.toString(),
      endDate: edu.endDate?.toString(),
      description: edu.description,
    };
  }
}
