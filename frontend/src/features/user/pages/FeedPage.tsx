import { useEffect, useState } from "react";

import { getAllPosts } from "../services/PostService";
import { PostResponseDTO } from "../types/post";
import FinalPost from "../componets/post/FinalPost";
import { useAppSelector } from "../../../hooks/useAppSelector";
import toast from "react-hot-toast";
// interface PostProps {
//   post: PostResponseDTO;
//   currentUserId: string;
//   onLike?: (postId: string) => Promise<void>;
// }
function FeedPage() {
  const [posts, setPost] = useState<PostResponseDTO[]>([]);
  const { id } = useAppSelector((state) => state.auth);
  const fetchPosts = async () => {
    const res = await getAllPosts();
    console.log("postsdata", res);
    setPost(res.data);
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  async function handleClick(id) {
    toast.success("success clickec");
    console.log("hello");
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

export default FeedPage;
