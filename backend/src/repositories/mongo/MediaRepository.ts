import { inject, injectable } from "inversify";
import { IMediaRepository } from "../../interfaces/repositories/IMediaRepository";
import { BaseRepository } from "./BaseRepository";
import { Model } from "mongoose";
import { TYPES } from "../../di/types";
import mediaModel from "../models/media.model";
import { IMedia } from "../entities/media.entity";

@injectable()
export class MediaRepository
  extends BaseRepository<IMedia>
  implements IMediaRepository
{
  constructor(@inject(TYPES.mediaModel) mediaModel: Model<IMedia>) {
    super(mediaModel);
  }

  async findByOwner(ownerId: string): Promise<IMedia[]> {
    return this.model.find({ ownerId });
  }
}
