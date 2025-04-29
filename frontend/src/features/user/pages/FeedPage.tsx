import { useEffect, useState } from "react";
import CreatePostSection from "../componets/post/CreatePostSection";
import PostCard from "../componets/post/PostCard";
import axios from "axios";

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
  userId:string;
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
  const [posts, setPosts] = useState<Post[]>([]); // Updated post state type
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true); // Check if more posts available
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
    <>
      <h1>Feed Page</h1>
      <CreatePostSection onPostSubmit={handlePostSubmit} />
      <div>
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {!hasMore && (
        <p style={{ textAlign: "center", margin: "20px" }}>
          No more posts to load!
        </p>
      )}
    </>
  );
}

export default FeedPage;
