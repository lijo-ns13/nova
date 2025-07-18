import React, { useEffect, useState } from "react";

import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import { PostResponseDTO } from "../../../types/post";
import { getAllUserPosts } from "../../../services/PostService";
import FinalPost from "../../post/FinalPost";
import toast from "react-hot-toast";
import { useAppSelector } from "../../../../../hooks/useAppSelector";

interface UserPostsSectionProps {
  userId: string;
}

const UserPostsSection: React.FC<UserPostsSectionProps> = ({ userId }) => {
  const { id } = useAppSelector((state) => state.auth);
  const [posts, setPosts] = useState<PostResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 5;
  async function handleClick(id) {
    toast.success("success clickec");
    console.log("hello");
  }
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getAllUserPosts({ page, limit });
        setPosts(response);
      } catch (error) {
        console.error("Error fetching posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
      </div>
    );
  }

  if (posts.length === 0) {
    return <p className="text-center text-gray-500">No posts available.</p>;
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <FinalPost
          key={post.id}
          post={post}
          currentUserId={id}
          onLike={() => handleClick(post.id)}
        />
      ))}
      {/* Pagination (Optional) */}
      <div className="flex justify-center mt-8 space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserPostsSection;
