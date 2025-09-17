import { IInterview } from "../../repositories/entities/interview.entity";
import { IJob } from "../../repositories/entities/job.entity";
import { IUser } from "../../repositories/entities/user.entity";

export type InterviewResponseDTO = {
  id: string;
  roomId: string;
  scheduledAt: string;
  status: "pending" | "accepted" | "rejected" | "reschedule_proposed";
  result: "pending" | "pass" | "fail";
  rescheduleReason?: string;
  rescheduleProposedSlots?: string[];
  rescheduleSelectedSlot?: string;
};

export type UpcomingInterviewResponseDTO = {
  id: string;
  roomId: string;
  interviewTime: string;
  applicationId: string;
  user: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    jobType: string;
  };
};

export class InterviewMapper {
  static toDTO(interview: IInterview): InterviewResponseDTO {
    return {
      id: interview._id.toString(),
      roomId: interview.roomId,
      status: interview.status,
      result: interview.result,
      scheduledAt: interview.scheduledAt.toISOString(),
      rescheduleReason: interview.rescheduleReason,
      rescheduleProposedSlots: interview.rescheduleProposedSlots?.map((slot) =>
        slot.toISOString()
      ),
      rescheduleSelectedSlot: interview.rescheduleSelectedSlot?.toISOString(),
    };
  }
  static toUpcomingDTO(
    interview: IInterview,
    user: IUser,
    job: IJob,
    applicationId: string
  ): UpcomingInterviewResponseDTO {
    return {
      id: interview._id.toString(),
      roomId: interview.roomId,
      interviewTime: interview.scheduledAt.toISOString(),
      applicationId,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
      job: {
        id: job._id.toString(),
        title: job.title,
        description: job.description,
        location: job.location,
        jobType: job.jobType,
      },
    };
  }
}
