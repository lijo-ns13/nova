import { IUser } from "../../repositories/entities/user.entity";

export interface IUserGoogleService {
  redirectToGoogle(): string;
  handleGoogleCallback(code: string): Promise<{
    user: IUser;
    accessToken: string;
    refreshToken: string;
  }>;
  refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }>;
  getUserFromAccessToken(token: string): Promise<IUser>;
  refreshUser(refreshToken: string): Promise<{
    user: IUser;
    accessToken: string;
  }>;
}
