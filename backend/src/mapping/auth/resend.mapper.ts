import { ResendDTO } from "../../core/dtos/auth";
import { resendEntity } from "../../repositories/entities/auth.entity";

export class ResendMapper {
  static fromDTO(dto: ResendDTO): resendEntity {
    return {
      email: dto.email.toLowerCase(),
    };
  }
}
