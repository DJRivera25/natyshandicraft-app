import axios from '../axios';
import { ChatRoom, Message } from '@/types/chat';

export const getChatRooms = async (): Promise<ChatRoom[]> => {
  const { data } = await axios.get('/api/chat/room');
  return data.rooms;
};

export const getMessages = async (roomId: string): Promise<Message[]> => {
  const { data } = await axios.get(`/api/chat/messages?chatRoomId=${roomId}`);
  return data.messages;
};

export const sendMessage = async (
  roomId: string,
  content: string
): Promise<void> => {
  await axios.post('/api/chat/message', { chatRoomId: roomId, content });
};

export const markMessageAsRead = async (messageId: string): Promise<void> => {
  await axios.patch(`/api/chat/message/${messageId}/read`);
};

export const setTyping = async (
  roomId: string,
  isTyping: boolean
): Promise<void> => {
  await axios.post(`/api/chat/room/${roomId}/typing`, { isTyping });
};
