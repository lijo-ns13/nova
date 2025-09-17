export interface IInterview {
  _id: string;
  companyId: string;
  userId: string;
  applicationId: string;
  scheduledAt: Date;
  roomId: string;
  result?: "pending" | "pass" | "fail";
}

export interface IInterviewResult {
  result: "pass" | "fail";
}

export interface IScheduleInterview {
  companyId: string;
  userId: string;
  applicationId: string;
  scheduledAt: Date;
}

// src/interfaces/interview.interface.ts
export interface InterviewResponse {
  roomId: string;
  interviewTime: Date;
  job: JobDetails;
  user: UserDetails;
  applicationId: string;
}

interface JobDetails {
  _id: string;
  title: string;
  description: string;
  location?: string;
  jobType?: string;
}

interface UserDetails {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}
