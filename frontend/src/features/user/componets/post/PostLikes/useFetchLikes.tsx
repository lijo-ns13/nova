import { useState, useEffect } from "react";
import { getPostLikes } from "../../../services/PostService";
import { LikeResponseDTO } from "../../../types/commentlike";

const useFetchLikes = (postId: string) => {
  const [likes, setLikes] = useState<LikeResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLikes = async () => {
    if (!postId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getPostLikes(postId);
      console.log("likesmodal", response);
      if (!response) {
        throw new Error(`Failed to fetch likes: `);
      }

      //   const data = (await response.json()) as LikesResponse;
      const data = response;
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
