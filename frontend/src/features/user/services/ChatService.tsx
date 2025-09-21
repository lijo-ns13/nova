import apiAxios from "../../../utils/apiAxios";

export interface ChatMessage {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface ChatUser {
  name: string;
  profilePicture: string | null;
}

export const ChatService = {
  getMessages(userId: string, otherUserId: string) {
    return apiAxios
      .get<{ data: ChatMessage[] }>(`/messages/${userId}/${otherUserId}`, {
        withCredentials: true,
      })
      .then((res) => res.data.data);
  },

  getUserDetails(userId: string) {
    return apiAxios
      .get<{ data: ChatUser }>(`/messages/username/${userId}`, {
        withCredentials: true,
      })
      .then((res) => res.data.data);
  },
};
