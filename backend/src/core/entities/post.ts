import { Types } from "mongoose";
import { IUser } from "../../repositories/entities/user.entity";
import { ILike } from "../../repositories/entities/like.entity";

export interface creatorIdUser {
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

// export interface IPostServiceResponse {
//   _id: string | Types.ObjectId; // Ensure _id is a string, not unknown
//   creatorId: Types.ObjectId | IUser; // Assuming creatorId should also be a string
//   description?: string; // Optional description
//   mediaUrls: { mediaUrl: string; mimeType: string }[];
//   createdAt: string;
//   Likes?: ILike[] | null;
// }

// export interface IPostServiceResponsePaginated {
//   posts: IPostServiceResponse[];
//   totalPosts?: number;
//   totalPages?: number;
//   currentPage?: number;
// }

export interface IPostServiceResponse {
  _id: Types.ObjectId;
  creatorId: Types.ObjectId | IUser;
  description?: string;
  mediaUrls: { mediaUrl: string; mimeType: string }[];
  createdAt: string;
  Likes?: ILike[] | null;
}

export interface IPostServiceResponsePaginated {
  posts: IPostServiceResponse[];
  totalPosts?: number;
  totalPages?: number;
  currentPage?: number;
}
export interface IUserProfileDTO {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilePictureUrl?: string;
  headline?: string;
  about?: string;
  skills: string[];
  isVerified: boolean;
  isBlocked: boolean;
  followersCount: number;
  followingCount: number;
  appliedJobCount: number;
  createdPostCount: number;
  subscriptionActive: boolean;
}
