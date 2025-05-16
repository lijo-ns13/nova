// src/features/chat/Chat.tsx
import { useEffect, useState } from "react";
import socket from "../../socket/socket";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { addMessage, setTypingUser } from "../../store/slice/chatSlice";

const currentUser = "USER1_ID"; // Replace with logged-in user ID
const otherUser = "USER2_ID"; // Replace with chat partner ID

export const Chat = () => {
  const [input, setInput] = useState("");
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.chat.messages);
  const typingUserId = useAppSelector((state) => state.chat.typingUserId);

  useEffect(() => {
    socket.emit("login", currentUser);

    socket.on("receiveMessage", (message) => {
      dispatch(addMessage(message));
    });

    socket.on("typing", ({ sender }) => {
      dispatch(setTypingUser(sender));
      setTimeout(() => dispatch(setTypingUser(null)), 2000);
    });

    socket.on("messageSent", (message) => {
      dispatch(addMessage(message));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("sendMessage", {
      sender: currentUser,
      receiver: otherUser,
      content: input,
    });
    setInput("");
  };

  const handleTyping = () => {
    socket.emit("typing", { sender: currentUser, receiver: otherUser });
  };

  return (
    <div>
      <h2>Chat</h2>
      <div
        style={{ border: "1px solid gray", height: 300, overflowY: "scroll" }}
      >
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.sender === currentUser ? "You" : "Them"}:</b> {msg.content}
          </div>
        ))}
        {typingUserId === otherUser && (
          <p>
            <i>Typing...</i>
          </p>
        )}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleTyping}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};
