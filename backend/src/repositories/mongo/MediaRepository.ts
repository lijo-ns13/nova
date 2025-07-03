import { inject, injectable } from "inversify";
import { IMediaRepository } from "../../interfaces/repositories/IMediaRepository";
import { BaseRepository } from "./BaseRepository";
import mediaModal, { IMedia } from "../../models/media.modal";
import { Model } from "mongoose";
import { TYPES } from "../../di/types";

@injectable()
export class MediaRepository
  extends BaseRepository<IMedia>
  implements IMediaRepository
{
  constructor(@inject(TYPES.mediaModal) mediaModal: Model<IMedia>) {
    super(mediaModal);
  }

  async findByOwner(ownerId: string): Promise<IMedia[]> {
    return this.model.find({ ownerId });
  }
}
