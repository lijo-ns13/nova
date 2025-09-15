import { IMedia } from "../../repositories/entities/media.entity";
import { IBaseRepository } from "./IBaseRepository";

export interface IMediaRepository extends IBaseRepository<IMedia> {
  findByOwner(ownerId: string): Promise<IMedia[]>;
}
