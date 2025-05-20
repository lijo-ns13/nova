// src/modules/job/repositories/InterviewRepository.ts
import { injectable } from "inversify";
import { Interview, IInterview } from "../../models/interview.modal";
import { BaseRepository } from "../../repositories/mongo/BaseRepository";
import { IInterviewRepository } from "../../interfaces/repositories/IInterviewRepository";

@injectable()
export class InterviewRepository
  extends BaseRepository<IInterview>
  implements IInterviewRepository
{
  constructor() {
    super(Interview);
  }

  async findByCompanyId(companyId: string): Promise<IInterview[]> {
    return this.model.find({ companyId }).exec();
  }

  async findByUserId(userId: string): Promise<IInterview[]> {
    return this.model.find({ userId }).exec();
  }

  async findByApplicationId(applicationId: string): Promise<IInterview | null> {
    return this.model.findOne({ applicationId }).exec();
  }

  async findByTimeSlot(
    companyId: string,
    scheduledAt: Date
  ): Promise<IInterview | null> {
    return this.model.findOne({ companyId, scheduledAt }).exec();
  }
}
