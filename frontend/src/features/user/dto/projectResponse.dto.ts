export interface ProjectResponseDTO {
  id: string;
  userId: string;
  title: string;
  description: string;
  projectUrl?: string;
  startDate: string;
  endDate?: string;
  technologies: string[];
}
