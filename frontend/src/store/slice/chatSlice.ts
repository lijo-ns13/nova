// src/features/chat/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  _id?: string;
  sender: string;
  receiver: string;
  content: string;
  isRead?: boolean;
  createdAt?: string;
}

interface ChatState {
  messages: Message[];
  typingUserId: string | null;
}

const initialState: ChatState = {
  messages: [],
  typingUserId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setTypingUser: (state, action: PayloadAction<string | null>) => {
      state.typingUserId = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
  },
});

export const { addMessage, setTypingUser, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
