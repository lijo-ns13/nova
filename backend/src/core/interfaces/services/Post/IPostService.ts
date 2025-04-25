// core/interfaces/services/IPostService.ts

import { IPost } from "../../../../infrastructure/database/models/post.modal";

export interface IPostService {
  createPost(data: {
    creatorId: string;
    creatorName: string;
    creatorAvatar?: string;
    description?: string;
    mediaIds?: string[];
  }): Promise<IPost>;
}
