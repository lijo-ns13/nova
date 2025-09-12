import { VerifyDTO } from "../../core/dtos/auth";
import { VerifyEntity } from "../../repositories/entities/auth.entity";

export class VerifyMapper {
  static fromDTO(dto: VerifyDTO): VerifyEntity {
    return {
      email: dto.email.toLowerCase(),
      otp: dto.otp,
    };
  }
}
