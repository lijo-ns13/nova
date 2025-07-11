export interface EducationResponseDTO {
  id: string;
  userId: string;
  institutionName: string;
  degree: string;
  fieldOfStudy?: string;
  grade?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}
