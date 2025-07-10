export interface CreateExperienceInputDTO {
  title: string;
  company: string;
  description?: string;
  location: string;
  startDate: string; // ISO string
  endDate?: string;
}

export interface ExperienceResponseDTO {
  id: string;
  userId: string;
  title: string;
  company: string;
  description?: string;
  location: string;
  startDate: string;
  endDate?: string;
}
