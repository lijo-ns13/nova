import { ProjectResponseDTO } from "../../core/dtos/user/userproject";
import { IUserProject } from "../../repositories/entities/project.entity";

export class ProjectMapper {
  static toDTO(project: IUserProject): ProjectResponseDTO {
    return {
      id: project._id.toString(),
      userId: project.userId.toString(),
      title: project.title,
      description: project.description,
      projectUrl: project.projectUrl || undefined,
      startDate: project.startDate.toISOString(),
      endDate: project.endDate?.toISOString(),
      technologies: project.technologies,
    };
  }
}
