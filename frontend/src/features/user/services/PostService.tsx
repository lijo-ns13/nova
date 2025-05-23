const BASE_URL = import.meta.env.VITE_API_BASE_URL;

import userAxios from "../../../utils/userAxios";
interface Payload {
  postId: string;
  content: string;
  parentId?: string;
  authorName: string;
}
// *****************post related

// Get one job by ID
export const CreatePost = async (jobId: string) => {
  const response = await userAxios.get(`${BASE_URL}/jobs/${jobId}`);
  return response.data;
};

// Apply to a job
export const GetPosts = async (jobId: string, resumeUrl: string) => {
  const response = await userAxios.post(
    `${BASE_URL}/jobs/${jobId}/apply`,
    { resumeUrl },
    { withCredentials: true }
  );
  return response.data;
};

// *************likes related
export const getPostLikes = async (postId: string) => {
  const response = await userAxios.get(`${BASE_URL}/post/like/${postId}`, {
    withCredentials: true,
  });
  return response.data;
};
// *(********) comment realted

export const AddComment = async (
  postId: string,
  content: string,
  parentId: string | null,
  authorName: string
) => {
  console.log("Base url", BASE_URL);
  const payload: Payload = {
    postId,
    content,
    authorName,
  };
  if (parentId) {
    payload.parentId = parentId;
  }
  const response = await userAxios.post(`${BASE_URL}/post/comment`, payload, {
    withCredentials: true,
  });
  return response.data;
};
export const fetchComments = async (postId: string, page: number) => {
  const response = await userAxios.get(
    `${BASE_URL}/post/comment/${postId}?page=${page}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};
export const toggleCommentLike = async (commentId: string) => {
  const response = await userAxios.post(
    `${BASE_URL}/post/comment/${commentId}/like`, // Removed colon
    { withCredentials: true }
  );
  return response.data;
};

export const updateComment = async (commentId: string, content: string) => {
  const response = await userAxios.put(
    `${BASE_URL}/post/comment/${commentId}`, // Removed colon
    { content },
    { withCredentials: true }
  );
  return response.data;
};

export const deleteComment = async (commentId: string) => {
  const response = await userAxios.delete(
    `${BASE_URL}/post/comment/${commentId}`, // Removed colon
    { withCredentials: true }
  );
  return response.data;
};

// Get user posts with pagination
export const getUserPosts = async (page: number = 1) => {
  try {
    const response = await userAxios.get(`${BASE_URL}/post/user`, {
      params: { page },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (postId: string): Promise<void> => {
  try {
    await userAxios.delete(`${BASE_URL}/post/${postId}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
