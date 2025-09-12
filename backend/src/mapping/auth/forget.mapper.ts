import { ForgetDTO } from "../../core/dtos/auth";
import { forgetEntity } from "../../repositories/entities/auth.entity";

export class ForgetMapper {
  static fromDTO(dto: ForgetDTO): forgetEntity {
    return {
      email: dto.email.toLowerCase(),
    };
  }
}
