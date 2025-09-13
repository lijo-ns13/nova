import bcrypt from "bcryptjs";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IJWTService } from "../../interfaces/services/IJwtService";
import { IAdminRepository } from "../../interfaces/repositories/IAdminRepository";
import { AdminSignInRequestDTO } from "../../core/dtos/admin/admin.auth.request.dto";
import { IAdminAuthService } from "../../interfaces/services/IAdminAuthService";
import logger from "../../utils/logger";
import { AdminSignInResponseDTO } from "../../dtos/response/admin/admin.auth.response.dto";
import { AdminAuthMapper } from "../../mapping/admin/admin.auth.mapper";
import { COMMON_MESSAGES } from "../../constants/message.constants";
@injectable()
export class AdminAuthService implements IAdminAuthService {
  private logger = logger.child({ service: "AdminAuthService" });
  constructor(
    @inject(TYPES.AdminRepository)
    private _admiRepository: IAdminRepository,
    @inject(TYPES.JWTService)
    private _jwtService: IJWTService
  ) {}
  async signIn(
    payload: AdminSignInRequestDTO
  ): Promise<AdminSignInResponseDTO> {
    const admin = await this._admiRepository.findByEmail(payload.email);
    if (!admin) {
      this.logger.warn(COMMON_MESSAGES.ADMIN_NOT_FOUND);
      throw new Error(COMMON_MESSAGES.ADMIN_NOT_FOUND);
    }
    const isPasswordValid = await bcrypt.compare(
      payload.password,
      admin.password
    );
    if (!isPasswordValid) {
      this.logger.warn(COMMON_MESSAGES.INVALID_PASSWORD);
      throw new Error(COMMON_MESSAGES.INVALID_PASSWORD);
    }
    const accessToken = this._jwtService.generateAccessToken("admin", {
      id: admin.id.toString(),
      email: admin.email,
      role: "admin",
    });
    const refreshToken = this._jwtService.generateRefreshToken("admin", {
      id: admin.id.toString(),
      email: admin.email,
      role: "admin",
    });

    return AdminAuthMapper.toDTO(admin, {
      accessToken,
      refreshToken,
    });
  }
}
