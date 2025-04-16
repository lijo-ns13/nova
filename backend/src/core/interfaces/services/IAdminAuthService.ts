// src/core/interfaces/services/IAdminAuthService.ts
import { AdminSignInRequestDTO } from "../../dtos/admin/admin.auth.request.dto";

export interface IAdminAuthService {
  signIn(payload: AdminSignInRequestDTO): Promise<any>;
}
