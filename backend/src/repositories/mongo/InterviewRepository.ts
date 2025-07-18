// src/modules/job/repositories/InterviewRepository.ts
import { inject, injectable } from "inversify";
import { Interview, IInterview } from "../../models/interview.modal";
import { BaseRepository } from "../../repositories/mongo/BaseRepository";
import { IInterviewRepository } from "../../interfaces/repositories/IInterviewRepository";
import { FilterQuery, Model, Types } from "mongoose";
import { TYPES } from "../../di/types";

@injectable()
export class InterviewRepository
  extends BaseRepository<IInterview>
  implements IInterviewRepository
{
  constructor(@inject(TYPES.Interview) Interview: Model<IInterview>) {
    super(Interview);
  }

  // async findByCompanyId(companyId: string): Promise<IInterview[]> {
  //   return this.model.find({ companyId }).exec();
  // }
  async findByCompanyId(companyId: string): Promise<IInterview[]> {
    return this.model
      .find({ companyId })
      .sort({ scheduledAt: -1 }) // Sort by most recent first
      .exec();
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
  async findByCompanyIdApplicantId(
    companyId: string,
    applicationId: string
  ): Promise<boolean> {
    const result = await this.model.findOne({ companyId, applicationId });
    return !!result;
  }
  async findByCompanyIdforPop(companyId: string): Promise<IInterview[]> {
    return this.model
      .find({
        companyId: new Types.ObjectId(companyId),
        scheduledAt: { $gte: new Date() },
      })
      .populate({
        path: "applicationId",
        populate: [{ path: "job" }, { path: "user" }],
      })
      .sort({ scheduledAt: 1 })
      .exec();
  }
  async findConflictingInterviewSlotIncludingProposals(
    companyId: string,
    slot: Date,
    excludeInterviewId?: string
  ): Promise<IInterview | null> {
    const bufferMs = 60 * 60 * 1000;

    const slotStart = new Date(slot.getTime() - bufferMs);
    const slotEnd = new Date(slot.getTime() + bufferMs);

    const filter: FilterQuery<IInterview> = {
      companyId: new Types.ObjectId(companyId),
      status: { $in: ["pending", "accepted", "reschedule_proposed"] },
      ...(excludeInterviewId && {
        _id: { $ne: new Types.ObjectId(excludeInterviewId) },
      }),
      $or: [
        {
          scheduledAt: { $lt: slotEnd, $gt: slotStart },
        },
        {
          rescheduleProposedSlots: {
            $elemMatch: { $lt: slotEnd, $gt: slotStart },
          },
        },
      ],
    };

    return Interview.findOne(filter).exec();
  }
  async findUpcomingWithApplication(companyId: string): Promise<IInterview[]> {
    return this.model
      .find({
        companyId: new Types.ObjectId(companyId),
        scheduledAt: { $gte: new Date() },
      })
      .populate({
        path: "applicationId",
        model: "Application",
        select: "status job user",
      })
      .sort({ scheduledAt: 1 })
      .exec();
  }
}
