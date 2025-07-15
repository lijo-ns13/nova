import userAxios from "../../../utils/userAxios";
import { APIResponse } from "../../../types/api";

import { handleApiError } from "../../../utils/apiError";
import { PostResponseDTO } from "../types/post";
import {
  CommentResponseDTO,
  CreateCommentInput,
  LikeResponseDTO,
} from "../types/commentlike";

// Fetch paginated posts
export const getAllPosts = async ({
  page = 1,
  limit = 10,
}): Promise<PostResponseDTO[]> => {
  try {
    const response = await userAxios.get(`/post?page=${page}&limit=${limit}`, {
      params: { page, limit },
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to get all posts");
  }
};

// Get one post by ID
export const getPostById = async (
  postId: string
): Promise<APIResponse<PostResponseDTO>> => {
  try {
    const response = await userAxios.get(`/post/${postId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "failed to get post by id ");
  }
};

// Create post
export const createPost = async (
  description: string,
  files: File[]
): Promise<APIResponse<PostResponseDTO>> => {
  try {
    const formData = new FormData();
    formData.append("description", description);
    files.forEach((file) => formData.append("media", file));

    const response = await userAxios.post(`/post`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "failed ot create post");
  }
};

// Update post
export const updatePost = async (
  postId: string,
  description: string
): Promise<APIResponse<PostResponseDTO>> => {
  try {
    const response = await userAxios.put(
      `/post/${postId}`,
      { description },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw handleApiError("failed to update post");
  }
};

// Delete post
export const deletePost = async (
  postId: string
): Promise<APIResponse<true>> => {
  try {
    const response = await userAxios.delete(`/post/${postId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "failed to delete post");
  }
};

export const likeOrUnlikePost = async (
  postId: string
): Promise<APIResponse<{ liked: boolean }>> => {
  try {
    const response = await userAxios.post(`/post/like/${postId}`, null, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to like or unlike post");
  }
};
export const getPostLikes = async (
  postId: string
): Promise<LikeResponseDTO[]> => {
  try {
    const response = await userAxios.get(`/post/like/${postId}`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to get likes for post");
  }
};
export const createComment = async (
  data: CreateCommentInput
): Promise<APIResponse<CommentResponseDTO>> => {
  try {
    const response = await userAxios.post("/post/comment", data, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to create comment");
  }
};
export const updateComment = async (
  commentId: string,
  content: string
): Promise<APIResponse<CommentResponseDTO>> => {
  try {
    const response = await userAxios.put(
      `/post/comment/${commentId}`,
      { content },
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to update comment");
  }
};
export const deleteComment = async (
  commentId: string
): Promise<APIResponse<true>> => {
  try {
    const response = await userAxios.delete(`/post/comment/${commentId}`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to delete comment");
  }
};
export const getPostComments = async (
  postId: string,
  page = 1,
  limit = 10
): Promise<CommentResponseDTO[]> => {
  try {
    const response = await userAxios.get(`/post/comment/${postId}`, {
      params: { page, limit },
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to fetch post comments");
  }
};
