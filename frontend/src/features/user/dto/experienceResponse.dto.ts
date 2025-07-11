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
