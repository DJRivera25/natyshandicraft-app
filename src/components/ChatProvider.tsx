import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import Pusher from 'pusher-js';
import { useSession } from 'next-auth/react';
import { ChatRoom, Message } from '@/types/chat';
import {
  getChatRooms,
  getMessages,
  sendMessage as sendMsg,
  markMessageAsRead as markMsgRead,
  setTyping as setTypingApi,
} from '@/utils/api/chat';
import { getUserById } from '@/utils/api/user';

interface ChatContextType {
  chatRooms: ChatRoom[];
  activeRoom: ChatRoom | null;
  messages: Message[];
  unreadCount: number;
  setActiveRoom: (room: ChatRoom | null) => void;
  sendMessage: (roomId: string, content: string) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  refetchRooms: () => void;
  refetchMessages: (roomId: string) => void;
  typingUsers: Record<string, boolean>;
  setTyping: (roomId: string, isTyping: boolean) => void;
  userNames: Record<string, string>;
  fetchUserName: (userId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [userNames, setUserNames] = useState<Record<string, string>>({});

  // Helper to fetch and cache user names
  const fetchUserName = useCallback(
    async (userId: string) => {
      if (!userId || userNames[userId]) return;
      try {
        const user = await getUserById(userId);
        setUserNames((prev) => ({
          ...prev,
          [userId]: user.fullName || user.email || userId,
        }));
      } catch {
        setUserNames((prev) => ({ ...prev, [userId]: userId }));
      }
    },
    [userNames]
  );

  // Fetch names for all participants in chatRooms
  useEffect(() => {
    const ids = new Set<string>();
    chatRooms.forEach((room) => {
      room.participants.forEach((id) => {
        if (id !== session?.user?.id) ids.add(id);
      });
    });
    ids.forEach((id) => fetchUserName(id));
  }, [chatRooms, session?.user?.id, fetchUserName]);

  const fetchRooms = useCallback(async () => {
    if (!session?.user) return;
    const rooms = await getChatRooms();
    setChatRooms(rooms);
    setUnreadCount(
      rooms.reduce((acc: number, room: ChatRoom) => {
        if (
          room.lastMessage &&
          !room.lastMessage.read &&
          room.lastMessage.sender !== session.user.id
        ) {
          return acc + 1;
        }
        return acc;
      }, 0)
    );
  }, [session?.user]);

  const fetchMessages = useCallback(
    async (roomId: string) => {
      if (!session?.user) return;
      const msgs = await getMessages(roomId);
      setMessages(msgs);
    },
    [session?.user]
  );

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (!activeRoom) return;
    fetchMessages(activeRoom._id);
  }, [activeRoom, fetchMessages]);

  useEffect(() => {
    if (!session?.user) return;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || '',
    });
    chatRooms.forEach((room) => {
      const channel = pusher.subscribe(`chat-room-${room._id}`);
      channel.bind('new-message', (data: Message) => {
        if (activeRoom && data.chatRoom === activeRoom._id) {
          setMessages((prev) => [...prev, data]);
        }
        fetchRooms();
      });
      channel.bind(
        'message-seen',
        (data: { messageId: string; userId: string }) => {
          setMessages((prev) =>
            prev.map((m) =>
              m._id === data.messageId ? { ...m, read: true } : m
            )
          );
        }
      );
      channel.bind('typing', (data: { userId: string; isTyping: boolean }) => {
        setTypingUsers((prev) => ({ ...prev, [data.userId]: data.isTyping }));
      });
    });
    return () => {
      chatRooms.forEach((room) => {
        const channel = pusher.channel(`chat-room-${room._id}`);
        if (channel) {
          channel.unbind_all();
          channel.unsubscribe();
        }
      });
      pusher.disconnect();
    };
  }, [session?.user, chatRooms, activeRoom]);

  const sendMessage = async (roomId: string, content: string) => {
    await sendMsg(roomId, content);
  };

  const markMessageAsRead = async (messageId: string) => {
    await markMsgRead(messageId);
    setMessages((prev) =>
      prev.map((m) => (m._id === messageId ? { ...m, read: true } : m))
    );
  };

  const setTyping = async (roomId: string, isTyping: boolean) => {
    await setTypingApi(roomId, isTyping);
  };

  return (
    <ChatContext.Provider
      value={{
        chatRooms,
        activeRoom,
        messages,
        unreadCount,
        setActiveRoom,
        sendMessage,
        markMessageAsRead,
        refetchRooms: fetchRooms,
        refetchMessages: fetchMessages,
        typingUsers,
        setTyping,
        userNames,
        fetchUserName,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
