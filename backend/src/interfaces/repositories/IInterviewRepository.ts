import { IInterview } from "../../repositories/entities/interview.entity";
import { IBaseRepository } from "./IBaseRepository";

export interface IInterviewRepository extends IBaseRepository<IInterview> {
  findByCompanyId(companyId: string): Promise<IInterview[]>;
  findByUserId(userId: string): Promise<IInterview[]>;
  findByApplicationId(applicationId: string): Promise<IInterview | null>;
  findByTimeSlot(
    companyId: string,
    scheduledAt: Date
  ): Promise<IInterview | null>;
  findByCompanyIdApplicantId(
    companyId: string,
    applicationId: string
  ): Promise<boolean>;
  findByCompanyIdforPop(companyId: string): Promise<IInterview[]>;
  findConflictingInterviewSlotIncludingProposals(
    companyId: string,
    slot: Date,
    excludeInterviewId?: string
  ): Promise<IInterview | null>;
  findUpcomingWithApplication(companyId: string): Promise<IInterview[]>;
}
