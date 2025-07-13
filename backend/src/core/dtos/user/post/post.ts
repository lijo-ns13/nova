export interface CreatePostInput {
  description: string;
  mediaFiles: Express.Multer.File[];
  creatorId: string;
}
export interface UpdatePostInput {
  postId: string;
  description: string;
  userId: string;
}
export interface PostResponseDTO {
  id: string;
  description: string;
  creatorId: string;
  mediaUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}
