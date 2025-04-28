"use client";

import { useState, useEffect } from "react";
import { MessageSquare } from "react-feather";

// Mock comments data
const mockComments = [
  {
    id: 1,
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=150&width=150",
    },
    content:
      "This is really insightful! I've been thinking about implementing something similar.",
    timestamp: "15m ago",
    likes: 5,
  },
  {
    id: 2,
    author: {
      name: "Maria Garcia",
      avatar: "/placeholder.svg?height=150&width=150",
    },
    content:
      "Great point about the color palette. Have you considered using a contrast checker for accessibility?",
    timestamp: "45m ago",
    likes: 3,
    replies: [
      {
        id: 21,
        author: {
          name: "Emma Watson",
          avatar: "/placeholder.svg?height=150&width=150",
        },
        content:
          "Yes! I've been using WebAIM's contrast checker. It's been really helpful.",
        timestamp: "30m ago",
        likes: 2,
      },
    ],
  },
];

const PostComments = ({ postId, commentCount }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReplies, setExpandedReplies] = useState({});

  useEffect(() => {
    // Simulate API call to fetch comments
    setTimeout(() => {
      setComments(mockComments);
      setLoading(false);
    }, 500);
  }, [postId]);

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="animate-pulse flex space-x-3">
            <div className="rounded-full bg-gray-200 h-8 w-8"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700 flex items-center">
        <MessageSquare size={16} className="mr-2" />
        Comments ({commentCount})
      </h4>

      {comments.map((comment) => (
        <div key={comment.id} className="space-y-3">
          <div className="flex space-x-3">
            <img
              src={comment.author.avatar || "/placeholder.svg"}
              alt={comment.author.name}
              className="h-8 w-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <div className="bg-gray-100 rounded-2xl px-4 py-2">
                <div className="font-medium text-gray-900">
                  {comment.author.name}
                </div>
                <p className="text-gray-700 text-sm">{comment.content}</p>
              </div>
              <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
                <span>{comment.timestamp}</span>
                <button className="font-medium hover:text-gray-700 transition-colors">
                  Like ({comment.likes})
                </button>
                <button className="font-medium hover:text-gray-700 transition-colors">
                  Reply
                </button>
              </div>

              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2">
                  <button
                    onClick={() => toggleReplies(comment.id)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                  >
                    {expandedReplies[comment.id]
                      ? "Hide replies"
                      : `View ${comment.replies.length} replies`}
                  </button>

                  {expandedReplies[comment.id] && (
                    <div className="mt-3 pl-3 border-l-2 border-gray-200 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-3">
                          <img
                            src={reply.author.avatar || "/placeholder.svg"}
                            alt={reply.author.name}
                            className="h-7 w-7 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="bg-gray-100 rounded-2xl px-3 py-2">
                              <div className="font-medium text-gray-900 text-sm">
                                {reply.author.name}
                              </div>
                              <p className="text-gray-700 text-sm">
                                {reply.content}
                              </p>
                            </div>
                            <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
                              <span>{reply.timestamp}</span>
                              <button className="font-medium hover:text-gray-700 transition-colors">
                                Like ({reply.likes})
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {comments.length < commentCount && (
        <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
          View more comments
        </button>
      )}
    </div>
  );
};

export default PostComments;
