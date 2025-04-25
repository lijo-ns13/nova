import { IMedia } from "../../../infrastructure/database/models/media.modal";
import { IBaseRepository } from "./IBaseRepository";

export interface IMediaRepository extends IBaseRepository<IMedia> {
  findByOwner(ownerId: string): Promise<IMedia[]>;
}
