import { ILike } from "../../../infrastructure/database/models/like.modal";
import { IBaseRepository } from "./IBaseRepository";

export interface ILikeRepository extends IBaseRepository<ILike> {
  findByUser(userId: string): Promise<ILike[]>;
}
