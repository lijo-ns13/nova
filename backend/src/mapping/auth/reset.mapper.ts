import { ResetDTO } from "../../core/dtos/auth";
import { resetEntity } from "../../repositories/entities/auth.entity";

export class ResetMapper {
  static fromDTO(dto: ResetDTO): resetEntity {
    return {
      token: dto.token.toString().trim(),
      password: dto.password.trim(),
      confirmPassword: dto.confirmPassword.trim(),
    };
  }
}
