import { Types } from "mongoose";

export interface IAdmin {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  socketId?: string;
  online?: boolean;
}
