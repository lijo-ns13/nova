import userAxios from "../../../utils/userAxios";
import { APIResponse } from "../../../types/api";

import { handleApiError } from "../../../utils/apiError";
import { PostResponseDTO } from "../types/post";

// Fetch paginated posts
export const getAllPosts = async (
  page = 1,
  limit = 10
): Promise<PostResponseDTO[]> => {
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
    files.forEach((file) => formData.append("files", file));

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
