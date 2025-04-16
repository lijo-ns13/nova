import bcrypt from "bcrypt";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../di/types";
import { IJWTService } from "../../../core/interfaces/services/IJwtService";
import { IAdminRepository } from "../../../core/interfaces/repositories/IAdminRepository";
import { AdminSignInRequestDTO } from "../../../core/dtos/admin/admin.auth.request.dto";
import { IAdminAuthService } from "../../../core/interfaces/services/IAdminAuthService";

@injectable()
export class AdminAuthService implements IAdminAuthService {
  constructor(
    @inject(TYPES.AdminRepository)
    private admiRepository: IAdminRepository,
    @inject(TYPES.JWTService)
    private jwtService: IJWTService
  ) {}
  async signIn(payload: AdminSignInRequestDTO) {
    const admin = await this.admiRepository.findByEmail(payload.email);
    if (!admin) throw new Error("Admin not found");

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      admin.password
    );
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const accessToken = this.jwtService.generateAccessToken("admin", {
      id: admin.id.toString(),
      email: admin.email,
      role: "admin",
    });
    const refreshToken = this.jwtService.generateRefreshToken("admin", {
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
