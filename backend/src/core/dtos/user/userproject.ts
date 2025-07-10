export interface CreateProjectInputDTO {
  title: string;
  description: string;
  projectUrl?: string;
  startDate: string; // ISO string
  endDate?: string;
  technologies: string[];
}

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
