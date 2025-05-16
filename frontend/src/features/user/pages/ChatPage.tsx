import { useEffect, useState, useRef } from "react";
import socket from "../../../socket/socket";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useParams } from "react-router-dom";
// import userAxios from "../../../utils/userAxios";
import { format } from "date-fns";
import { PaperPlaneRight, Spinner } from "@phosphor-icons/react";
import userAxios from "../../../utils/userAxios";

const ChatPage = () => {
  const { otherUserId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { id: userId } = useAppSelector((state) => state.auth);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages on load
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      socket.emit("login", userId);
    }
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const res = await userAxios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/messages/${userId}/${otherUserId}`,
          { withCredentials: true }
        );
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Listen for incoming messages
    socket.on("receiveMessage", (msg) => {
      if (
        (msg.sender === otherUserId && msg.receiver === userId) ||
        (msg.sender === userId && msg.receiver === otherUserId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [otherUserId, userId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const tempId = Date.now().toString();
    const msg = {
      sender: userId,
      receiver: otherUserId,
      content: newMessage,
      createdAt: new Date().toISOString(),
      _id: tempId,
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");

    // Emit message with tempId
    socket.emit("sendMessage", {
      sender: userId,
      receiver: otherUserId,
      content: msg.content,
      tempId,
    });

    // Listen for success
    socket.once(`messageSent-${tempId}`, (confirmedMessage) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? confirmedMessage : m))
      );
    });

    // Listen for failure
    socket.once(`messageFailed-${tempId}`, () => {
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      // Optionally show an error toast or retry button here
    });
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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat header */}
      <div className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">
          Chat with {otherUserId}
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-center p-8 max-w-md">
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
                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${
                  msg.sender === userId
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none shadow"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === userId ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {format(new Date(msg.createdAt), "h:mm a")}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white p-4 border-t">
        <div className="flex items-center rounded-full bg-gray-100 px-4 py-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`ml-2 p-2 rounded-full ${
              newMessage.trim()
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-500"
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
