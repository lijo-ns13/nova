import { IPost } from "../../../infrastructure/database/models/post.modal";
import { IBaseRepository } from "./IBaseRepository";

export interface IPostRepository extends IBaseRepository<IPost> {
  findByCreator(creatorId: string): Promise<IPost[]>;
}
