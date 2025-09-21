import { useEffect, useState, useRef } from "react";
import socket from "../../../socket/socket";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { PaperPlaneRight, Spinner } from "@phosphor-icons/react";
import debounce from "lodash.debounce";
import apiAxios from "../../../utils/apiAxios";

const ChatPage = () => {
  const { otherUserId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const { id: userId } = useAppSelector((state) => state.auth);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [otherUserName, setOtherUserName] = useState<string>("");
  const [otherUserProfilePicture, setOtherUserProfilePicture] =
    useState<string>("");
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      socket.emit("login", userId);
    }

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const res = await apiAxios.get(`/messages/${userId}/${otherUserId}`, {
          withCredentials: true,
        });
        setMessages(res.data.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchOtherUser = async () => {
      try {
        const res = await apiAxios.get(`/messages/username/${otherUserId}`, {
          withCredentials: true,
        });
        console.log("data", res.data.data);
        const { name, profilePicture } = res.data.data;
        setOtherUserName(name);
        setOtherUserProfilePicture(profilePicture);
        // setOtherUserName(name);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchOtherUser();

    fetchMessages();

    socket.on("receiveMessage", (msg) => {
      if (
        (msg.sender === otherUserId && msg.receiver === userId) ||
        (msg.sender === userId && msg.receiver === otherUserId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on("typing", ({ sender }) => {
      if (sender === otherUserId) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    });

    socket.on("messagesRead", ({ receiver }) => {
      if (receiver === otherUserId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.receiver === receiver ? { ...msg, isRead: true } : msg
          )
        );
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("messagesRead");
    };
  }, [otherUserId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Send read notification if there are unread messages
    const hasUnread = messages.some(
      (msg) => msg.sender === otherUserId && !msg.isRead
    );
    if (hasUnread) {
      if (otherUserId) {
        socket.emit("readMessages", {
          sender: otherUserId,
          receiver: userId,
        });
      }
    }
  }, [messages, otherUserId, userId]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const tempId = Date.now().toString();
    const msg = {
      sender: userId,
      receiver: otherUserId,
      content: newMessage,
      createdAt: new Date().toISOString(),
      _id: tempId,
      isRead: false,
    };

    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
    if (otherUserId) {
      socket.emit("sendMessage", {
        sender: userId,
        receiver: otherUserId,
        content: msg.content,
        tempId,
      });
    }

    if (tempId) {
      socket.once(
        `messageSent-${tempId}` as any,
        (confirmedMessage: string) => {
          setMessages((prev) =>
            prev.map((m) => (m._id === tempId ? confirmedMessage : m))
          );
        }
      );

      socket.once(`messageFailed-${tempId}` as any, () => {
        setMessages((prev) => prev.filter((m) => m._id !== tempId));
      });
    }
  };

  const debouncedTyping = useRef(
    debounce((sender: string, receiver: string) => {
      socket.emit("typing", { sender, receiver });
    }, 200)
  ).current;

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (userId && otherUserId) {
      debouncedTyping(userId, otherUserId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }
  // w-full max-w-screen overflow-x-hidden
  return (
    <div className="w-full h-[calc(100vh-90px)] overflow-hidden  flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* ===== HEADER ===== */}
      <div
        className="shrink-0 sticky top-0 z-20 flex items-center justify-between
                    px-4 py-3 bg-white dark:bg-gray-800 shadow-sm
                    border-b border-gray-200 dark:border-gray-700"
      >
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 
                   hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="hidden sm:inline text-sm font-medium">Back</span>
        </button>

        <div className="flex items-center gap-3">
          {otherUserProfilePicture && (
            <img
              src={otherUserProfilePicture}
              alt={otherUserName}
              className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-200 dark:border-gray-600"
            />
          )}
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            {otherUserName || "Unknown User"}
          </h1>
        </div>
      </div>

      {/* ===== MESSAGES ===== */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-center p-6 sm:p-8 max-w-md">
              <h2 className="text-2xl font-light mb-2">No messages yet</h2>
              <p className="text-gray-400">
                Start the conversation by sending your first message
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-xs sm:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 text-sm break-words shadow-md ${
                  msg.sender === userId
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white dark:bg-gray-700 dark:text-gray-100 rounded-bl-none"
                }`}
              >
                {msg.content}
                <div
                  className={`mt-1 text-xs flex items-center gap-1 opacity-70 ${
                    msg.sender === userId
                      ? "text-blue-100"
                      : "text-gray-500 dark:text-gray-300"
                  }`}
                >
                  {format(new Date(msg.createdAt), "h:mm a")}
                  {msg.sender === userId && msg.isRead && <span>✓</span>}
                </div>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="ml-2 text-sm text-blue-500 animate-pulse">
            Typing…
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ===== INPUT ===== */}
      <div className="shrink-0 px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 shadow-inner">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            placeholder="Type your message…"
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm sm:text-base"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`ml-2 p-2 rounded-full transition-colors ${
              newMessage.trim()
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
            }`}
          >
            <PaperPlaneRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
