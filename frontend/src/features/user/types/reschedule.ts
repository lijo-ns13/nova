export interface RescheduleRequest {
  id: string;
  applicationId: string;
  candidateName: string;
  position: string;
  company: string;
  originalDateTime: string;
  requestedDateTime?: string;
  reason: string;
  status:
    | "pending"
    | "interview_reschedule_accepted"
    | "interview_reschedule_rejected";
  createdAt: string;
  availableSlots?: string[];
}

export interface Application {
  id: string;
  candidateName: string;
  position: string;
  company: string;
  interviewDateTime: string;
  status: string;
  rescheduleRequests?: RescheduleRequest[];
}
