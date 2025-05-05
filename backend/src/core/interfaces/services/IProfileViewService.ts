// src/core/interfaces/services/IProfileViewService.ts

import { IUser } from "../../../infrastructure/database/models/user.modal";

export interface IProfileViewService {
  /**
   * Fetches basic profile data of a user including related certifications, experiences, projects, and educations.
   * @param username The username of the user whose data is to be fetched.
   * @returns A promise resolving to the user data object.
   */
  getUserBasicData(username: string): Promise<IUser>;
  getUserPostData(page: number, limit: number, username: string): Promise<any>;
}
