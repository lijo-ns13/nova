import { AdminSignInResponseDTO } from "../../dtos/response/admin/admin.auth.response.dto";
import { IAdmin } from "../../models/admin.modal";

export class AdminAuthMapper {
  static toSignInResponse(
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
}
