import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PostResponseDTO } from "../../types/post";

import { useAppSelector } from "../../../../hooks/useAppSelector";
import { getAllPosts } from "../../services/PostService";
import FinalPost from "./FinalPost";
import LoadingSpinner from "../../../../components/LoadingSpinner";
const page = 1;
const limit = 10;
function PostList() {
  const queryClient = useQueryClient();
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery<PostResponseDTO[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await getAllPosts({ page, limit });
      return res;
    },
    staleTime: 10 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const { id } = useAppSelector((state) => state.auth);
  async function handleClick(id) {
    toast.success("success clickec");
    console.log("hello");
  }
  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    return (
      <div className="text-red-600 p-4">
        Failed to load posts. Please try again later.
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <FinalPost
          key={post.id}
          post={post}
          currentUserId={id}
          onLike={() => handleClick(post.id)}
        />
      ))}
    </>
  );
}

export default PostList;
