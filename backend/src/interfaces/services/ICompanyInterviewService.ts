import {
  CreateInterviewInput,
  ProposeRescheduleInput,
} from "../../core/dtos/company/interview.dto";
import { InterviewResponseDTO } from "../../mapping/company/interview.mapper";
import { IInterview } from "../../repositories/entities/interview.entity";

export interface ICompanyInterviewService {
  createInterview(input: CreateInterviewInput): Promise<InterviewResponseDTO>;

  proposeReschedule(
    input: ProposeRescheduleInput
  ): Promise<InterviewResponseDTO>;

  getUpcomingAcceptedInterviews(companyId: string): Promise<IInterview[]>;
}
