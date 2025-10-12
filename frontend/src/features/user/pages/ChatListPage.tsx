import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { formatDistanceToNow } from "date-fns";
import Navbar from "../componets/NavBar";
import { Search, X, MessageSquare, Heart } from "lucide-react";
import apiAxios from "../../../utils/apiAxios";

const ChatListPage = () => {
  const { id: userId } = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [likedUsers, setLikedUsers] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiAxios.get(`/messages/chat/users/${userId}`, {
          withCredentials: true,
        });
        setUsers(res.data.data);
      } catch (error) {
        console.error("Error fetching chat users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userId]);

  const toggleLike = (userId) => {
    setLikedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAvatarContent = (user) => {
    if (user.profilePicture) {
      return (
        <img
          src={user.profilePicture || "default.png"}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
        />
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
        <span className="text-white font-medium text-base">
          {user.name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-3xl mx-auto space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
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
      <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sticky top-[4rem] z-30 bg-white shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {isSearching ? (
            <div className="flex items-center w-full gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-8 py-1.5 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-900 placeholder-gray-400 text-sm border border-gray-200 shadow-sm transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearching(false);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                  aria-label="Clear search"
                >
                  <X size={14} className="text-gray-500" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Messages
              </h1>
              <button
                onClick={() => setIsSearching(true)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                aria-label="Search conversations"
              >
                <Search size={18} className="text-gray-600" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Chat List Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-16 sm:pt-20">
        <div className="max-w-3xl mx-auto w-full">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 sm:p-8 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-3 rounded-full bg-indigo-50 mb-3">
                <MessageSquare size={24} className="text-indigo-500" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
                {searchQuery ? "No matches found" : "No messages yet"}
              </h3>
              <p className="text-gray-500 max-w-md text-xs sm:text-sm leading-5">
                {searchQuery
                  ? "Try a different search term or check your spelling."
                  : "Start a conversation with someone to see your messages here."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 px-4 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-xs font-medium transition-colors duration-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100 rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center p-3 sm:p-4 hover:bg-indigo-50/50 cursor-pointer transition-all duration-200 ease-in-out active:bg-indigo-100"
                  onClick={() => navigate(`/message/${user._id}`)}
                >
                  <div className="relative mr-3">
                    {getAvatarContent(user)}
                    {user.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-1.5 border-white shadow-sm"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate pr-4">
                        {user.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {user.lastMessage && (
                          <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                            {formatDistanceToNow(
                              new Date(user.lastMessage.createdAt),
                              { addSuffix: true }
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    {user.lastMessage && (
                      <p className="text-xs text-gray-500 truncate leading-tight">
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
