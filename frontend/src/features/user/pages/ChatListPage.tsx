import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useAppSelector";
import userAxios from "../../../utils/userAxios";
import { formatDistanceToNow } from "date-fns";

const ChatListPage = () => {
  const { id: userId } = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Chats</h1>
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between p-3 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => navigate(`/message/${user._id}`)}
          >
            <div className="flex items-center gap-3">
              <img
                src={user.profilePicture || "/default-avatar.png"}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{user.name}</p>
                {user.lastMessage && (
                  <p className="text-sm text-gray-500 truncate w-48">
                    {user.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right text-xs text-gray-400">
              {user.lastMessage && (
                <p>
                  {formatDistanceToNow(new Date(user.lastMessage.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              )}
              {user.online && (
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-1" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatListPage;
