"use client";

import { useState } from "react";
import { Maximize2 as ExpandIcon } from "react-feather";

const PostMedia = ({ media }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (media.type === "image") {
    return (
      <div className="relative group">
        <img
          src={media.url || "/placeholder.svg"}
          alt="Post media"
          className="w-full object-cover max-h-[500px]"
        />
        <button
          onClick={() => setIsExpanded(true)}
          className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ExpandIcon size={16} />
        </button>

        {isExpanded && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setIsExpanded(false)}
          >
            <img
              src={media.url || "/placeholder.svg"}
              alt="Expanded media"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <div className="relative">
        <video src={media.url} controls className="w-full rounded-md" />
      </div>
    );
  }

  if (media.type === "code") {
    return (
      <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
        <pre className="text-sm">
          <code>{media.content}</code>
        </pre>
      </div>
    );
  }

  return null;
};

export default PostMedia;
