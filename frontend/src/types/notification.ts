export interface Sender {
  _id: string;
  name: string;
  username: string;
  profilePicture: string;
}

export interface Notification {
  _id: string;
  userId: string;
  senderId?: Sender | null;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}