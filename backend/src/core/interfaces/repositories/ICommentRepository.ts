import { IComment } from "../../../infrastructure/database/models/comment.modal";
import { IBaseRepository } from "./IBaseRepository";

export interface ICommentRepository extends IBaseRepository<IComment> {
  findByPost(postId: string): Promise<IComment[]>;
  findReplies(parentId: string): Promise<IComment[]>;
}
