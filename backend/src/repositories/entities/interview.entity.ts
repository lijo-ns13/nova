import { Types } from "mongoose";

export interface IInterview {
  _id: Types.ObjectId;
  companyId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  applicationId: Types.ObjectId | string;
  scheduledAt: Date;
  status: "pending" | "accepted" | "rejected" | "reschedule_proposed";
  result: "pending" | "pass" | "fail";
  roomId: string;
  rescheduleProposedSlots?: Date[];
  rescheduleReason?: string;
  rescheduleSelectedSlot?: Date;
}
