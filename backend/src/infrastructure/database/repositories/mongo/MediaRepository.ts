import { injectable } from "inversify";
import { IMediaRepository } from "../../../../core/interfaces/repositories/IMediaRepository";
import { BaseRepository } from "./BaseRepository";
import mediaModal, { IMedia } from "../../models/media.modal";

@injectable()
export class MediaRepository
  extends BaseRepository<IMedia>
  implements IMediaRepository
{
  constructor() {
    super(mediaModal);
  }

  async findByOwner(ownerId: string): Promise<IMedia[]> {
    return this.model.find({ ownerId });
  }
}
