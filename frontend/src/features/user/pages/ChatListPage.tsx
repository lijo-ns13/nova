import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useAppSelector";
import userAxios from "../../../utils/userAxios";
import { formatDistanceToNow } from "date-fns";
import Navbar from "../componets/NavBar";
import { Search, MoreVertical, MessageSquare } from "lucide-react";

const ChatListPage = () => {
  const { id: userId } = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userAxios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/chat/users/${userId}`,
          { withCredentials: true }
        );
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching chat users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userId]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAvatarContent = (user: any) => {
    if (user.profilePicture) {
      return (
        <img
          src={user.profilePicture}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
        <span className="text-blue-600 dark:text-blue-300 font-medium text-sm">
          {user.name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="space-y-4 w-full max-w-md">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 animate-pulse"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Header and Search */}
      <div className="bg-white dark:bg-gray-900 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Messages
          </h1>
          <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <MoreVertical
              size={20}
              className="text-gray-600 dark:text-gray-400"
            />
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search messages"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-6 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <MessageSquare size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              {searchQuery ? "No matches found" : "No messages yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs">
              {searchQuery
                ? "Try a different search term"
                : "Start a conversation with someone"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => navigate(`/message/${user._id}`)}
              >
                <div className="relative mr-3">
                  {getAvatarContent(user)}
                  {user.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </h3>
                    {user.lastMessage && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                        {formatDistanceToNow(
                          new Date(user.lastMessage.createdAt),
                          {
                            addSuffix: true,
                          }
                        )}
                      </span>
                    )}
                  </div>

                  {user.lastMessage && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatListPage;
