import { injectable } from "inversify";
import { IPostRepository } from "../../../../core/interfaces/repositories/IPostRepository";
import { BaseRepository } from "./BaseRepository";
import postModal, { IPost } from "../../models/post.modal";

@injectable()
export class PostRepository
  extends BaseRepository<IPost>
  implements IPostRepository
{
  constructor() {
    super(postModal);
  }

  async findByCreator(creatorId: string): Promise<IPost[]> {
    return this.model.find({ creatorId });
  }
}
