import dayjs from "dayjs";

interface NotificationModalProps {
  notifications: Notification[];
  unreadCount: number;
  onClose: () => void;
  markAsRead: (id: string) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  notifications,
  unreadCount,
  onClose,
  markAsRead,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto z-10 mx-4">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications found.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notif: any) => (
              <li
                key={notif._id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                  !notif.isRead ? "bg-blue-50 dark:bg-blue-900/30" : ""
                }`}
                onClick={() => !notif.isRead && markAsRead(notif._id)}
              >
                <div className="flex items-start gap-3">
                  {notif.senderId?.profilePicture ? (
                    <img
                      src={notif.senderId.profilePicture}
                      alt={notif.senderId.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white">
                      ?
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-medium">
                        {notif.senderId?.name ?? "System"}
                      </span>{" "}
                      {notif.content}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {dayjs(notif.createdAt).fromNow()}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
