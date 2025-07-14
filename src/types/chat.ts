export interface Message {
  _id: string;
  chatRoom: string;
  sender: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface ChatRoom {
  _id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}
