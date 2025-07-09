import {
  CreateInterviewInput,
  ProposeRescheduleInput,
} from "../../core/dtos/company/interview.dto";
import {
  InterviewResponseDTO,
  UpcomingInterviewResponseDTO,
} from "../../mapping/company/interview.mapper";

export interface ICompanyInterviewService {
  createInterview(input: CreateInterviewInput): Promise<InterviewResponseDTO>;

  proposeReschedule(
    input: ProposeRescheduleInput
  ): Promise<InterviewResponseDTO>;

  getUpcomingAcceptedInterviews(
    companyId: string
  ): Promise<UpcomingInterviewResponseDTO[]>;
}
