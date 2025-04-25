import { injectable } from "inversify";
import { ICommentRepository } from "../../../../core/interfaces/repositories/ICommentRepository";
import { BaseRepository } from "./BaseRepository";
import commentModal, { IComment } from "../../models/comment.modal";

@injectable()
export class CommentRepository
  extends BaseRepository<IComment>
  implements ICommentRepository
{
  constructor() {
    super(commentModal);
  }

  async findByPost(postId: string): Promise<IComment[]> {
    return this.model.find({ postId });
  }

  async findReplies(parentId: string): Promise<IComment[]> {
    return this.model.find({ parentId });
  }
}
