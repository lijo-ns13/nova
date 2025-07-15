export interface PostResponseDTO {
  id: string;
  description?: string;
  creatorId: {
    id: string;
    name: string;
    profilePicture: string;
    headline: string;
    username: string;
  };
  media: {
    url: string;
    mimeType:
      | "image/jpeg"
      | "image/png"
      | "image/webp"
      | "video/mp4"
      | "video/quicktime"
      | "application/pdf";
  }[];
  likes: {
    userId: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
