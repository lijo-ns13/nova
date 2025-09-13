import { AdminSignInRequestDTO } from "../../core/dtos/admin/admin.auth.request.dto";
import { AdminSignInResponseDTO } from "../../dtos/response/admin/admin.auth.response.dto";
import {
  AdminSignInEntity,
  IAdmin,
} from "../../repositories/entities/admin.entity";

export class AdminAuthMapper {
  static toDTO(
    admin: IAdmin,
    tokens: { accessToken: string; refreshToken: string }
  ): AdminSignInResponseDTO {
    return {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
  static fromDTO(dto: AdminSignInRequestDTO): AdminSignInEntity {
    return {
      email: dto.email.toLowerCase(),
      password: dto.password,
    };
  }
}
