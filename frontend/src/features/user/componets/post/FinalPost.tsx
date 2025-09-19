import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  MoreHorizontal,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader,
} from "lucide-react";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";

import { Link } from "react-router-dom";
import LikesButton from "./PostLikes/LikesButton";
import { PostResponseDTO } from "../../types/post";
import {
  deletePost,
  getPostComments,
  likeOrUnlikePost,
} from "../../services/PostService";
import socket, { connectSocket } from "../../../../socket/socket";
import { useQueryClient } from "@tanstack/react-query";
import { CommentResponseDTO } from "../../types/commentlike";
import CommentSection from "./CommentSection";
import ConfirmDeleteModal from "../../../../components/ConfirmDeleteModal";
import toast from "react-hot-toast";
import { useAppSelector } from "../../../../hooks/useAppSelector";

interface PostProps {
  post: PostResponseDTO;
  currentUserId: string;
  onLike?: (postId: string) => Promise<void>;
}

const FinalPost: React.FC<PostProps> = ({ post, currentUserId, onLike }) => {
  const [likeCount, setLikeCount] = useState<number>(post.likes.length);
  const [liked, setLiked] = useState<boolean>(
    post.likes.some((like) => like.userId === currentUserId)
  );
  const { name: CurrentUserName } = useAppSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentResponseDTO[]>([]);
  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const commentsData = await getPostComments(post.id);
      setComments(commentsData);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };
  const confirmDelete = async () => {
    if (!selectedPostId) return;

    try {
      await deletePost(selectedPostId);
      queryClient.setQueryData<PostResponseDTO[] | undefined>(
        ["posts"],
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter((post) => post.id !== selectedPostId);
        }
      );
      toast.success("Post deleted");
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post");
    } finally {
      setShowDeleteModal(false);
      setSelectedPostId(null);
    }
  };

  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState<boolean>(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const queryClient = useQueryClient();
  useEffect(() => {
    connectSocket(); // make sure socket is connected
    socket.emit("join-post-room", post.id); // join this post room

    socket.on("post:like", ({ postId: likedPostId, liked, userId }) => {
      if (likedPostId !== post.id || userId === currentUserId) return;

      setLikeCount((prev) => prev + (liked ? 1 : -1));
    });

    return () => {
      socket.emit("leave-post-room", post.id);
      socket.off("post:like");
    };
  }, [post.id, currentUserId]);

  // Preload next and previous images
  useEffect(() => {
    if (post.media.length <= 1) return;

    const nextIndex = (currentMediaIndex + 1) % post.media.length;
    const prevIndex =
      (currentMediaIndex - 1 + post.media.length) % post.media.length;
    const imagesToPreload = [nextIndex, prevIndex]
      .map((index) => post.media[index])
      .filter((media) => media.mimeType.startsWith("image"));

    imagesToPreload.forEach((media) => {
      const img = new Image();
      img.src = media.url;
      img.onload = () => {
        setLoadedImages((prev) => new Set(prev).add(media.url));
      };
    });
  }, [currentMediaIndex, post.media]);

  const handleLike = async (userId: string, postId: string) => {
    try {
      const likedNow = await likeOrUnlikePost(postId);

      queryClient.setQueryData(
        ["posts"],
        (oldData: PostResponseDTO[] | PostResponseDTO | undefined) => {
          if (!oldData) return oldData;

          // Function to update a single post
          const updatePost = (post: PostResponseDTO) => {
            if (post.id === postId) {
              let updatedLikes = [...post.likes];

              if (likedNow) {
                // Add like if not already present
                if (!updatedLikes.some((like) => like.userId === userId)) {
                  updatedLikes.push({ userId });
                }
              } else {
                // Remove like if present
                updatedLikes = updatedLikes.filter(
                  (like) => like.userId !== userId
                );
              }

              return {
                ...post,
                likes: updatedLikes,
              };
            }
            return post;
          };

          // Handle both array of posts and single post cases
          if (Array.isArray(oldData)) {
            return oldData.map(updatePost);
          } else {
            return updatePost(oldData);
          }
        }
      );

      // Animation and state updates
      setIsLikeAnimating(true);
      setTimeout(() => setIsLikeAnimating(false), 1000);
      setLiked(!liked);
      setLikeCount((prev) => prev + (liked ? -1 : 1));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  const handleNextMedia = () => {
    if (post.media.length > 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % post.media.length);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const handlePrevMedia = () => {
    if (post.media.length > 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentMediaIndex(
        (prevIndex) => (prevIndex - 1 + post.media.length) % post.media.length
      );
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const toggleComments = async () => {
    if (!showComments) {
      await fetchComments();
    }
    setShowComments(!showComments);
  };

  const handleImageLoad = (mediaUrl: string) => {
    setLoadedImages((prev) => new Set(prev).add(mediaUrl));
  };
  const handleDeleteClick = (postId: string) => {
    setSelectedPostId(postId);
    setShowDeleteModal(true);
    queryClient.setQueryData<PostResponseDTO[] | undefined>(
      ["posts"],
      (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter((post) => post.id !== selectedPostId);
      }
    );
  };

  const isImageLoaded = (mediaUrl: string) => loadedImages.has(mediaUrl);
  console.log(
    "currentUserId === post.creatorId.id",
    currentUserId === post.creatorId.id
  );
  console.log(
    "currentuserid",
    currentUserId,
    "post.creatorId.id",
    post.creatorId.id
  );
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 my-6 border border-gray-200 dark:border-gray-700 transform hover:translate-y-[-2px]">
      {/* Post Header */}
      <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-700">
        <Avatar
          src={post.creatorId.profilePicture}
          alt={post.creatorId.name}
          size="md"
          bordered
        />

        <div className="ml-3 flex-1">
          <Link to={`/in/${post.creatorId.username}`}>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
              {post.creatorId.name}
            </h3>
          </Link>
          <p className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            {formatDate(post.createdAt)}
          </p>
        </div>
        {currentUserId === post.creatorId.id && (
          <button
            onClick={() => handleDeleteClick(post.id)}
            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors ml-2"
            title="Delete Post"
          >
            Delete
          </button>
        )}
      </div>

      {/* Post Content */}
      <div className="p-4">
        <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-line">
          {post.description}
        </p>
      </div>

      {/* Media Content */}
      {post.media.length > 0 && (
        <div className="relative bg-gray-100 dark:bg-gray-900 group">
          {post.media.length > 1 && (
            <button
              onClick={handlePrevMedia}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous media"
              disabled={isTransitioning}
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <div className="flex justify-center items-center overflow-hidden">
            {post.media.map((media, index) => (
              <div
                key={index}
                className={`w-full transition-opacity duration-300 ${
                  index === currentMediaIndex
                    ? "opacity-100"
                    : "opacity-0 hidden"
                }`}
              >
                {media.mimeType.startsWith("image") ? (
                  <div className="relative group/image aspect-[4/3] bg-gray-200 dark:bg-gray-800">
                    {!isImageLoaded(media.url) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader className="w-8 h-8 animate-spin text-gray-400" />
                      </div>
                    )}
                    <img
                      src={media.url}
                      alt={`Media ${index + 1}`}
                      className={`w-full h-full object-contain transition-opacity duration-300 ${
                        isImageLoaded(media.url) ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => handleImageLoad(media.url)}
                      loading={index === currentMediaIndex ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ) : media.mimeType === "application/pdf" ? (
                  <div className="aspect-[4/3] bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm mx-auto max-w-md">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        PDF Document
                      </h3>
                      <p className="text-gray-500 dark:text-gray-300 text-sm mb-4">
                        View or download the attached PDF document
                      </p>
                      <Button
                        variant="primary"
                        icon={<Download size={16} />}
                        onClick={() => window.open(media.url, "_blank")}
                      >
                        View PDF
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {post.media.length > 1 && (
            <>
              <button
                onClick={handleNextMedia}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Next media"
                disabled={isTransitioning}
              >
                <ChevronRight size={20} />
              </button>

              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
                {post.media.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentMediaIndex
                        ? "bg-indigo-500 scale-125 w-3"
                        : "bg-white/40 hover:bg-white/70"
                    }`}
                    onClick={() => {
                      if (!isTransitioning) {
                        setIsTransitioning(true);
                        setCurrentMediaIndex(index);
                        setTimeout(() => setIsTransitioning(false), 300);
                      }
                    }}
                    disabled={isTransitioning}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <LikesButton
              postId={post.id}
              likeCount={likeCount}
              liked={liked}
              isLikeAnimating={isLikeAnimating}
              onLike={() => handleLike(currentUserId, post.id)}
            />

            <button
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              onClick={toggleComments}
              aria-label="Show comments"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Comments</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
          {/* {isLoadingComments ? (
            <div className="flex justify-center py-4">
              <Loader className="animate-spin text-gray-500" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar
                    src={"/defualt.png"} // Add this to your CommentResponseDTO if needed
                    alt={comment.authorName}
                    size="sm"
                  />
                  <div className="flex-1">
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-800 dark:text-white">
                          {comment.authorName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )} */}

          {/* Comment input */}
          {/* {showComments && ( */}
          <CommentSection
            postId={post.id}
            currentUserId={currentUserId}
            currentUserName={CurrentUserName}
            currentUserAvatar={"/default.png"}
          />
          {/* )} */}
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default FinalPost;
