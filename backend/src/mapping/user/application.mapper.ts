import { IJob } from "../../models/job.modal";
import { IApplicationPopulatedJob } from "../../repositories/entities/applicationPopulated.entity";
import { IAppliedJob } from "../../repositories/mongo/ApplicationRepository";

export class ApplicationMapper {
  static toAppliedJobDTO(doc: IApplicationPopulatedJob): IAppliedJob {
    return {
      _id: doc._id,
      job: {
        _id: (doc.job as IJob)._id,
        title: (doc.job as IJob).title,
        description: (doc.job as IJob).description,
        location: (doc.job as IJob).location,
        jobType: (doc.job as IJob).jobType,
      },
      appliedAt: doc.appliedAt,
      status: doc.status,
      resumeMediaId: doc.resumeMediaId,
      statusHistory: doc.statusHistory,
      scheduledAt: doc.scheduledAt,
      coverLetter: doc.coverLetter,
      notes: doc.notes,
    };
  }
}
