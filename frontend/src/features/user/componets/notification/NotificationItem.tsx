import { NotificationType } from "../types/notification";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "job":
      return "💼";
    case "post":
      return "📝";
    case "comment":
      return "💬";
    case "like":
      return "❤️";
    case "friend_request":
      return "👋";
    case "message":
      return "✉️";
    default:
      return "🔔";
  }
};

const getNotificationLink = (type: NotificationType, relatedId?: string) => {
  if (!relatedId) return "#";

  switch (type) {
    case "job":
      return `/jobs/${relatedId}`;
    case "post":
      return `/posts/${relatedId}`;
    case "comment":
      return `/posts/${relatedId}`; // Assuming comments are on posts
    case "like":
      return `/posts/${relatedId}`;
    case "friend_request":
      return `/profile/${relatedId}`;
    case "message":
      return `/messages/${relatedId}`;
    default:
      return "#";
  }
};

export const NotificationItem = ({
  _id,
  userId,
  content,
  type,
  relatedId,
  isRead,
  createdAt,
}: {
  _id: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  type: NotificationType;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}) => {
  const { markAsRead } = useNotifications();

  const handleClick = () => {
    if (!isRead) {
      markAsRead(_id);
    }
  };

  return (
    <Link
      to={getNotificationLink(type, relatedId)}
      onClick={handleClick}
      className={`p-4 border-b border-gray-200 flex items-start gap-3 ${
        !isRead ? "bg-blue-50" : "bg-white"
      } hover:bg-gray-50 transition-colors`}
    >
      <span className="text-2xl">{getNotificationIcon(type)}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {userId.avatar && (
            <img
              src={userId.avatar}
              alt={userId.name}
              className="w-6 h-6 rounded-full"
            />
          )}
          <p className="text-sm font-medium text-gray-900">{content}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>
      {!isRead && (
        <span className="w-2 h-2 rounded-full bg-blue-500 mt-1"></span>
      )}
    </Link>
  );
};
