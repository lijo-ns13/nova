import { injectable } from "inversify";
import { ILikeRepository } from "../../../../core/interfaces/repositories/ILikeRepository";
import { BaseRepository } from "./BaseRepository";
import likeModal, { ILike } from "../../models/like.modal";

@injectable()
export class LikeRepository
  extends BaseRepository<ILike>
  implements ILikeRepository
{
  constructor() {
    super(likeModal);
  }

  async findByUser(userId: string): Promise<ILike[]> {
    return this.model.find({ userId });
  }
}
