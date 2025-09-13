import mongoose from "mongoose";
import { IMessage } from "../entities/message.entity";
import { MessageSchema } from "../schema/message.schema";

export default mongoose.model<IMessage>("Message", MessageSchema);
