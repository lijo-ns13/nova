import { useEffect, useState } from "react";
import CreatePostSection from "../componets/post/CreatePostSection";

function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true); // Check if more posts available

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/posts?page=${page}`);
      const newPosts = await res.json();

      if (newPosts.length === 0) {
        setHasMore(false); // No more posts to load
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
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
      <h1>feed page</h1>
      <CreatePostSection onPostSubmit={handlePostSubmit} />
      <div>
        {posts.map((post: any) => (
          <div
            key={post.id}
            style={{
              marginBottom: "20px",
              padding: "10px",
              border: "1px solid #ccc",
            }}
          >
            <p>{post.content}</p>
            {/* You can add post.image, post.likes, etc if available */}
          </div>
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
