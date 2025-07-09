export type CreateInterviewInput = {
  companyId: string;
  userId: string;
  applicationId: string;
  jobId: string;
  scheduledAt: string;
};

export type ProposeRescheduleInput = {
  companyId: string;
  applicationId: string;
  jobId: string;
  reason: string;
  timeSlots: string[];
};
