import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, AlertCircle, RefreshCw } from "lucide-react";
import FinalPost from "../../post/FinalPost";
import DeletePostModal from "./DeletePostModal";

// Define Post and related interfaces
interface User {
  _id: string;
  name: string;
  username: string;
  profilePicture: string;
}

interface Media {
  mediaUrl: string;
  mimeType: string;
}

interface ILike {
  _id: string;
  postId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Post {
  _id: string;
  creatorId: User;
  description: string;
  mediaUrls: Media[];
  createdAt: string;
  Likes: ILike[];
}

interface PostsResponse {
  posts: Post[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
}

interface UserPostsSectionProps {
  userId: string;
}

const UserPostsSection = ({ userId }: UserPostsSectionProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch user posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get<PostsResponse>(
          `${import.meta.env.VITE_API_BASE_URL}/post/user`,
          {
            withCredentials: true,
            params: { page },
          }
        );

        const { posts: newPosts, totalPages, currentPage } = response.data;

        setPosts((prev) =>
          currentPage === 1 ? newPosts : [...prev, ...newPosts]
        );
        setHasMore(currentPage < totalPages);
      } catch (err) {
        console.error("Error fetching user posts:", err);
        setError("Failed to load posts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [page, refreshKey]);

  // Handle like post
  const handleLikePost = async (postId: string) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/post/like/${postId}`,
        {},
        {
          withCredentials: true,
        }
      );

      // Return a resolved promise (FinalPost component expects this)
      return Promise.resolve();
    } catch (error) {
      console.error("Error liking post:", error);
      return Promise.reject(error);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (postId: string) => {
    setPostToDelete(postId);
    setDeleteModalOpen(true);
  };

  // Handle delete post
  const handleDeletePost = async () => {
    if (!postToDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/post/${postToDelete}`,
        {
          withCredentials: true,
        }
      );

      // Remove deleted post from state
      setPosts((prev) => prev.filter((post) => post._id !== postToDelete));
      setDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post. Please try again.");
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setPage(1);
    setRefreshKey((prev) => prev + 1);
  };

  // Load more posts
  const loadMorePosts = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(2)
      .fill(0)
      .map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse my-6"
        >
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex-1">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
            </div>
          </div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
          </div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
          <div className="p-4 flex justify-between">
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ));
  };

  // Empty state
  const renderEmptyState = () => (
    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <div className="mb-4 bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
        <RefreshCw className="text-indigo-500 dark:text-indigo-400 h-8 w-8" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No posts yet
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
        You haven't created-aany posts yet. Start sharing your thoughts, images,
        and updates!
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Posts
        </h2>
        <button
          onClick={handleRefresh}
          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-500 dark:text-red-400 h-5 w-5" />
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-3 ml-8 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Posts list */}
      {isLoading && posts.length === 0 ? (
        renderSkeletons()
      ) : posts.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="relative group">
              <FinalPost
                post={post}
                currentUserId={userId}
                onLike={handleLikePost}
              />

              {/* Delete button - only visible on hover or focus */}
              <button
                onClick={() => openDeleteModal(post._id)}
                className="absolute top-4 right-14 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/30"
                aria-label="Delete post"
              >
                <Trash2 size={16} className="text-red-500 dark:text-red-400" />
              </button>
            </div>
          ))}

          {/* Load more */}
          {hasMore && (
            <div className="text-center pt-2 pb-6">
              <button
                onClick={loadMorePosts}
                disabled={isLoading}
                className="px-5 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Load More Posts"}
              </button>
            </div>
          )}

          {/* End of posts */}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-4">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                End of posts
              </p>
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      <DeletePostModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeletePost}
      />
    </div>
  );
};

export default UserPostsSection;
