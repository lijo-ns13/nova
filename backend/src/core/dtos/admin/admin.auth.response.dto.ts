export interface AdminAuthResponseDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  accessToken?: string;
  refreshToken?: string;
}
