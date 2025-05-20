import { useState, useEffect } from "react";
import { getPostLikes } from "../../../services/PostService";

interface User {
  _id: string;
  name: string;
  username: string;
  profilePicture: string;
}

interface Like {
  _id: string;
  postId: string;
  userId: User | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface LikesResponse {
  likes: Like[];
}

const useFetchLikes = (postId: string) => {
  const [likes, setLikes] = useState<Like[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLikes = async () => {
    if (!postId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getPostLikes(postId);

      if (!response) {
        throw new Error(`Failed to fetch likes: `);
      }

      //   const data = (await response.json()) as LikesResponse;
      const data = response.likes;
      setLikes(data || []);
    } catch (err) {
      console.error("Error fetching likes:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch likes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // We don't auto-fetch on mount to avoid unnecessary API calls
    // The parent component will call fetchLikes when needed
  }, [postId]);

  return { likes, isLoading, error, fetchLikes };
};

export default useFetchLikes;
