import { MediaResponseDTO } from "../core/dtos/response/media.response.dto";
import { IMedia } from "../repositories/entities/media.entity";

export class MediaMapper {
  static toDTO(media: IMedia): MediaResponseDTO {
    return {
      id: media._id.toString(),
      mimeType: media.mimeType,
      s3Key: media.s3Key,
      createdAt: media.createdAt,
    };
  }
}
