// src/modules/job/repositories/InterviewRepository.ts
import { inject, injectable } from "inversify";
import { Interview, IInterview } from "../../models/interview.modal";
import { BaseRepository } from "../../repositories/mongo/BaseRepository";
import { IInterviewRepository } from "../../interfaces/repositories/IInterviewRepository";
import { Model } from "mongoose";
import { TYPES } from "../../di/types";

@injectable()
export class InterviewRepository
  extends BaseRepository<IInterview>
  implements IInterviewRepository
{
  constructor(@inject(TYPES.Interview) Interview: Model<IInterview>) {
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
