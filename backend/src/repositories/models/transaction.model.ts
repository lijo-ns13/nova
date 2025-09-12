import mongoose from "mongoose";
import { ITransaction } from "../entities/transaction.entity";
import { TransactionSchema } from "../schema/transaction.schema";

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
