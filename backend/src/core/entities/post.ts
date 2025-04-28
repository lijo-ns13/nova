import { Date, Types } from "mongoose";
import { IUser } from "../../infrastructure/database/models/user.modal";

interface creatorIdUser {
  _id: string;
  name: string;
  profilePicture: string;
}
export interface IPostResponse {
  _id: string;
  creatorId: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  mediaIds: {
    _id: string;
    s3Key: string;
    mimeType: string;
    ownerId: string;
    ownerModel: "User" | "Company"; // assuming only these models?
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
  }[];
  description?: string; // if description field is also needed
}

export interface IUserMiniProfile {
  _id: string;
  name: string;
  profilePicture: string;
}
export interface IPostServiceResponse {
  _id: string | Types.ObjectId; // Ensure _id is a string, not unknown
  creatorId: Types.ObjectId | IUser; // Assuming creatorId should also be a string
  description?: string; // Optional description
  mediaUrls: { mediaUrl: string; mimeType: string }[];
  createdAt: string;
}

export interface IPostServiceResponsePaginated {
  posts: IPostServiceResponse[];
  totalPosts?: number;
  totalPages?: number;
  currentPage?: number;
}
