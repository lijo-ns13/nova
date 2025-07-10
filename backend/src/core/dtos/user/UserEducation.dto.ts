export interface CreateEducationInputDTO {
  institutionName: string;
  degree: string;
  fieldOfStudy?: string;
  grade?: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

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
