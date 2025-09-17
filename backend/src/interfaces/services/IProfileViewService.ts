import { IUser } from "../../repositories/entities/user.entity";

export interface IProfileViewService {
  getUserBasicData(username: string): Promise<IUser>;
  getUserPostData(page: number, limit: number, username: string): Promise<any>;
}
