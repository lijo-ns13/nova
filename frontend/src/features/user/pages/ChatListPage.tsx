import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useAppSelector";

import { formatDistanceToNow } from "date-fns";
import Navbar from "../componets/NavBar";
import { Search, MoreVertical, MessageSquare, ArrowLeft } from "lucide-react";
import apiAxios from "../../../utils/apiAxios";

const ChatListPage = () => {
  const { id: userId } = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiAxios.get(
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
          src={user.profilePicture || "default.png"}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        // <SecureCloudinaryImage
        //   publicId={user.profilePicture}
        //   className="w-12 h-12 rounded-full object-cover"
        // />
      );
    }
    return (
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
        <span className="text-blue-600 font-medium text-lg">
          {user.name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-md mx-auto space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar />

      {/* Header */}
      <div className="border-b border-gray-100 p-4 sticky top-10 z-10 bg-white">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {isSearching ? (
            <div className="flex items-center w-full">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setIsSearching(false);
                }}
                className="mr-2 p-1 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search conversations"
                  className="w-full pl-4 pr-10 py-2 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Search
                  size={16}
                  className="absolute right-3 top-2.5 text-gray-400"
                />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSearching(true)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Search size={20} className="text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chat List Content */}
      <div className="flex-1 overflow-y-auto mt-10">
        <div className="max-w-md mx-auto">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="p-4 rounded-full bg-gray-50 mb-4">
                <MessageSquare size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {searchQuery ? "No matches found" : "No messages yet"}
              </h3>
              <p className="text-gray-500 max-w-xs">
                {searchQuery
                  ? "Try a different search term"
                  : "Start a conversation with someone"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/message/${user._id}`)}
                >
                  <div className="relative mr-3">
                    {getAvatarContent(user)}
                    {user.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {user.name}
                      </h3>
                      {user.lastMessage && (
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
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
                      <p className="text-sm text-gray-500 truncate mt-1">
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
    </div>
  );
};

export default ChatListPage;
