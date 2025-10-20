import { IUserProfileDTO } from "../../core/entities/post";

export interface IProfileViewService {
  getUserBasicData(username: string): Promise<IUserProfileDTO>;
  // getUserBasicData(username: string): Promise<IUser>;
  getUserPostData(page: number, limit: number, username: string): Promise<any>;
}
