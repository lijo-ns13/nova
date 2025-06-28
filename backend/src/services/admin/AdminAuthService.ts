import bcrypt from "bcryptjs";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IJWTService } from "../../interfaces/services/IJwtService";
import { IAdminRepository } from "../../interfaces/repositories/IAdminRepository";
import { AdminSignInRequestDTO } from "../../core/dtos/admin/admin.auth.request.dto";
import { IAdminAuthService } from "../../interfaces/services/IAdminAuthService";

@injectable()
export class AdminAuthService implements IAdminAuthService {
  constructor(
    @inject(TYPES.AdminRepository)
    private _admiRepository: IAdminRepository,
    @inject(TYPES.JWTService)
    private _jwtService: IJWTService
  ) {}
  async signIn(payload: AdminSignInRequestDTO) {
    const admin = await this._admiRepository.findByEmail(payload.email);
    if (!admin) throw new Error("Admin not found");

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      admin.password
    );
    if (!isPasswordValid) throw new Error("Invalid credentials");

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

    return {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      accessToken,
      refreshToken,
    };
  }
}
