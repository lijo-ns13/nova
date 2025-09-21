import { Types } from "mongoose";

export interface MessageDTO {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
