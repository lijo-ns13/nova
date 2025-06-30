import { useEffect, useState } from "react";
import CreatePostSection from "../componets/post/CreatePostSection";
import FinalPost from "../componets/post/FinalPost";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { RefreshCw, AlertCircle } from "lucide-react";
import Button from "../componets/ui/Button";
import { SubscriptionModal } from "../componets/subscription/SubscriptionModal";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { setHasShownSubscriptionModal } from "../../../store/slice/uiSlice";

// Throttle function
function throttle<T extends (...args: any[]) => void>(func: T, limit: number) {
  let inThrottle: boolean;
  return (...args: any[]) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Define Post and User Types
interface User {
  _id: string;
  name: string;
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

function FeedPage() {
  const { id } = useAppSelector((state) => state.auth);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const { isSubscriptionTaken } = useAppSelector((state) => state.auth);
  // const { hasShownSubscriptionModal } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("subscriptionModalShown");

    if (!isSubscriptionTaken && !alreadyShown) {
      setShowModal(true);
      sessionStorage.setItem("subscriptionModalShown", "true"); // persist for this session
      dispatch(setHasShownSubscriptionModal(true));
    }
  }, [isSubscriptionTaken, dispatch]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setError(null);
        if (page === 1) setIsLoading(true);
        else setIsLoadingMore(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/post?page=${page}`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        const newPosts: Post[] = data.posts;

        if (newPosts.length === 0) {
          setHasMore(false);
        } else {
          setPosts((prevPosts) => {
            if (page === 1) return newPosts;

            // Filter out duplicates when paginating
            const postIds = new Set(prevPosts.map((p) => p._id));
            const filtered = newPosts.filter((post) => !postIds.has(post._id));
            return [...prevPosts, ...filtered];
          });
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchPosts();
  }, [page, refreshKey]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (isLoading || isLoadingMore || !hasMore) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const nearBottom = scrollPosition >= document.body.scrollHeight - 800;

      if (nearBottom) {
        setPage((prevPage) => prevPage + 1);
      }
    }, 300);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, isLoadingMore, hasMore]);

  // Handle post creation
  const handlePostSubmit = () => {
    // Reset to page 1 and refresh feed
    setPage(1);
    setRefreshKey((prev) => prev + 1);
  };

  // Handle post like
  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/post/like/${postId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to like post");

      return await response.json();
    } catch (error) {
      console.error("Error liking post:", error);
      throw error;
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setPage(1);
    setRefreshKey((prev) => prev + 1);
  };

  // Loading skeletons
  const renderSkeletons = () => {
    return Array(3)
      .fill(0)
      .map((_, i) => (
        <div
          key={`skeleton-${i}`}
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
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-md"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-sm mt-2"></div>
          </div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
          <div className="p-4 flex justify-between">
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Create post section */}
      <CreatePostSection onPostSubmit={handlePostSubmit} />

      {/* Feed header */}
      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Your Feed
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          icon={<RefreshCw size={16} />}
          className="text-indigo-600 dark:text-indigo-400"
        >
          Refresh
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-500 dark:text-red-400 h-5 w-5" />
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
          <Button
            variant="outlined"
            size="sm"
            onClick={handleRefresh}
            className="mt-3 ml-8 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        renderSkeletons()
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="mb-4 bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <RefreshCw className="text-indigo-500 dark:text-indigo-400 h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No posts yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            Be the first to create a post, or check back later for updates from
            people you follow.
          </p>
          <Button
            variant="primary"
            onClick={() =>
              document
                .querySelector(".bg-white")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Create a Post
          </Button>
        </div>
      ) : (
        <>
          {/* Posts */}
          <div className="space-y-2">
            {posts.map((post) => (
              <FinalPost
                key={post._id}
                post={post}
                currentUserId={id}
                onLike={handleLikePost}
              />
            ))}
          </div>

          {/* Loading more indicator */}
          {isLoadingMore && (
            <div className="flex justify-center py-6">
              <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          )}

          {/* End of feed */}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8 mt-4">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mb-6"></div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                You've reached the end of your feed
              </p>
              <Button
                variant="ghost"
                onClick={handleRefresh}
                className="mt-2 text-indigo-600 dark:text-indigo-400"
              >
                Refresh to see new posts
              </Button>
            </div>
          )}
        </>
      )}
      {showModal && <SubscriptionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default FeedPage;
