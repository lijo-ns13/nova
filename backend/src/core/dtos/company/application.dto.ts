import { ApplicationStatus } from "../../enums/applicationStatus";

export interface ApplicationResponseDto {
  id: string;
  jobId: string;
  userId: string;
  appliedAt: Date;
  resumeUrl?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  notes?: string;
  scheduledAt?: Date;
  statusHistory: {
    status: ApplicationStatus;
    changedAt: Date;
    reason?: string;
  }[];
}
export interface IApplicationWithUserAndJob {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    profilePicture?: string;
  };
  job: {
    id: string;
    title: string;
    companyId: string;
  };
}
