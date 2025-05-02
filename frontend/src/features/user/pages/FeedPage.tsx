import { useEffect, useState } from "react";
import CreatePostSection from "../componets/post/CreatePostSection";
import EnhancedPostCard from "../componets/post/EnhancedPostCard";
import axios from "axios";
import { useAppSelector } from "../../../hooks/useAppSelector";

// Throttle function type
function throttle<T extends (...args: any[]) => void>(func: T, limit: number) {
  let inThrottle: boolean;
  return function (...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Define Post and PostCard Prop Types
interface User {
  _id: string;
  name: string;
  profilePicture: string;
}

interface Media {
  mediaUrl: string;
  mimeType: string;
}
export interface ILike {
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
  const [posts, setPosts] = useState<Post[]>([]); // Updated post state type
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true); // Check if more posts available
  const [currentUserId, setCurrentUserId] = useState<string>(id); // Replace with actual user ID from auth

  console.log("PostsSate", posts);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get(`http://localhost:3000/post?page=${page}`, {
        withCredentials: true,
      });
      console.log("res", res.data.posts);
      const newPosts: Post[] = res.data.posts; // Explicit type for newPosts

      if (newPosts.length === 0) {
        setHasMore(false); // No more posts to load
      } else {
        setPosts((prevPosts) => {
          const postIds = new Set(prevPosts.map((p) => p._id));
          const filtered = newPosts.filter((post) => !postIds.has(post._id));
          return [...prevPosts, ...filtered];
        });
      }
    };

    fetchPosts();
  }, [page]);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 300;

      if (nearBottom && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }, 300); // throttled every 300ms

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]); // Important to listen to hasMore

  const handlePostSubmit = () => {
    console.log("Post submitted!");
    // Later: refresh feed, send to backend, etc
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <CreatePostSection onPostSubmit={handlePostSubmit} />

      <div className="space-y-8 mt-8">
        {posts.map((post) => (
          <EnhancedPostCard
            key={post._id}
            post={post}
            currentUserId={currentUserId}
          />
        ))}
      </div>

      {!hasMore && (
        <p className="text-center py-6 text-gray-400 italic mt-8">
          No more posts to load!
        </p>
      )}
    </div>
  );
}

export default FeedPage;
