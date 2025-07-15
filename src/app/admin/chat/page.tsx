'use client';

import React from 'react';
import { useChat } from '@/components/ChatProvider';
import { User, MessageCircle, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import AdminButton from '@/components/AdminButton';
import { getUserById } from '@/utils/api/user';
import { format, isValid, parseISO } from 'date-fns';

function timeAgo(date: string) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
}

export default function AdminChatPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;
  const {
    chatRooms,
    activeRoom,
    setActiveRoom,
    messages,
    sendMessage,
    typingUsers,
    setTyping,
    markMessageAsRead,
  } = useChat();
  const [input, setInput] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const chatRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [userNames, setUserNames] = React.useState<Record<string, string>>({});
  const typingTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = React.useRef(false);

  const handleFocus = () => {
    if (activeRoom && !isTypingRef.current) {
      setTyping(activeRoom._id, true);
      isTypingRef.current = true;
    }
  };

  const handleBlur = () => {
    if (activeRoom && isTypingRef.current) {
      setTyping(activeRoom._id, false);
      isTypingRef.current = false;
    }
  };

  // Helper to fetch and cache user names
  const fetchUserName = React.useCallback(
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

  // Fetch names for all participants (except admin) in chatRooms
  React.useEffect(() => {
    chatRooms.forEach((room) => {
      room.participants.forEach((p) => {
        if (p !== session?.user?.id && !userNames[p]) {
          fetchUserName(p);
        }
      });
    });
  }, [chatRooms, session?.user?.id, userNames, fetchUserName]);

  React.useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, activeRoom]);

  React.useEffect(() => {
    if (activeRoom && messages.length > 0) {
      messages.forEach((msg) => {
        if (!msg.read && msg.sender !== session?.user?.id) {
          // Only mark as read if not already read and not sent by the admin
          markMessageAsRead(msg._id);
        }
      });
    }
  }, [activeRoom, messages, session?.user?.id, markMessageAsRead]);

  React.useEffect(() => {
    const timeout = typingTimeout.current;
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-amber-900 mb-4">Unauthorized</h1>
        <p className="text-gray-700">
          You must be an admin to access this page.
        </p>
      </div>
    );
  }

  // Sort chatRooms by latest message
  const sortedChatRooms = [...chatRooms].sort((a, b) => {
    const aTime = a.lastMessage?.createdAt
      ? new Date(a.lastMessage.createdAt).getTime()
      : 0;
    const bTime = b.lastMessage?.createdAt
      ? new Date(b.lastMessage.createdAt).getTime()
      : 0;
    return bTime - aTime;
  });

  let headerDisplayName = 'User';
  if (activeRoom) {
    const headerUserId = activeRoom.participants.find(
      (p) => p !== session?.user?.id
    );
    if (headerUserId) {
      headerDisplayName = userNames[headerUserId] || headerUserId;
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-[80vh] max-w-6xl mx-auto bg-white rounded-xl shadow border border-amber-200/60 overflow-hidden mt-8">
      {/* Sidebar: Chat Room List */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-amber-100 bg-gradient-to-b from-amber-50 to-white flex-shrink-0 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
          <span className="font-semibold text-amber-900 text-base">
            User Chats
          </span>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-amber-50">
          {sortedChatRooms.length === 0 ? (
            <div className="p-6 text-center text-amber-700 text-sm flex flex-col items-center gap-2">
              <MessageCircle className="w-8 h-8 text-amber-200 mx-auto" />
              No conversations yet.
            </div>
          ) : (
            sortedChatRooms.map((room) => {
              const last = room.lastMessage;
              const unread =
                last && !last.read && last.sender !== session?.user?.id;
              const otherUserId = room.participants.find(
                (id) => id !== session?.user?.id
              );
              let displayName = 'User';
              if (otherUserId) {
                displayName = userNames[otherUserId] || otherUserId;
              }
              return (
                <button
                  key={room._id}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${activeRoom?._id === room._id ? 'bg-amber-50' : 'bg-white hover:bg-amber-50/60'}`}
                  onClick={() => setActiveRoom(room)}
                >
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-amber-900 font-medium truncate">
                      {displayName}
                    </div>
                    <div className="text-xs text-amber-700 truncate">
                      {last ? last.content : 'No messages yet.'}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {last && (
                      <span className="text-xs text-amber-400">
                        {timeAgo(last.createdAt)}
                      </span>
                    )}
                    {unread && (
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>
      {/* Main Panel: Conversation */}
      <main className="flex-1 flex flex-col">
        {!activeRoom ? (
          <div className="flex-1 flex flex-col items-center justify-center text-amber-700">
            <MessageCircle className="w-16 h-16 mb-4 text-amber-200" />
            <h2 className="text-xl font-semibold mb-2">
              Select a chat to view messages
            </h2>
            <p className="text-sm">
              Click a user chat on the left to start a conversation.
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
              <div className="flex items-center gap-2">
                <User className="w-6 h-6 text-amber-500" />
                <span className="font-semibold text-amber-900 text-base">
                  {headerDisplayName}
                </span>
              </div>
              <button
                className="md:hidden p-1 rounded-full hover:bg-amber-100"
                aria-label="Close chat"
                onClick={() => setActiveRoom(null)}
              >
                <X className="w-5 h-5 text-amber-500" />
              </button>
            </div>
            {/* Messages */}
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-amber-50"
              style={{ minHeight: 200, maxHeight: 'calc(70vh - 120px)' }}
            >
              {messages.length === 0 ? (
                <div className="text-center text-amber-700 text-sm mt-8">
                  No messages yet. Say hello!
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender === session?.user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`rounded-xl px-4 py-2 max-w-[70%] text-sm shadow-md ${msg.sender === session?.user?.id ? 'bg-amber-500 text-white' : 'bg-white text-amber-900 border border-amber-100'}`}
                    >
                      {msg.content}
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-gray-400">
                          {(() => {
                            if (!msg.createdAt) return '—';
                            const dateObj = parseISO(msg.createdAt);
                            return isValid(dateObj)
                              ? format(dateObj, 'PPpp')
                              : '—';
                          })()}
                        </span>
                        {msg.sender === session?.user?.id &&
                          (msg.read ? (
                            <span className="ml-1 text-blue-500">✓✓</span>
                          ) : (
                            <span className="ml-1 text-gray-400">✓</span>
                          ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {/* Typing indicator */}
              {Object.entries(typingUsers).some(
                ([userId, isTyping]) => isTyping && userId !== session?.user?.id
              ) && (
                <div className="flex items-center gap-2 text-xs text-amber-500 animate-pulse">
                  <span>Someone is typing...</span>
                </div>
              )}
            </div>
            {/* Input */}
            <form
              className="flex items-center gap-2 px-4 py-3 border-t border-amber-100 bg-white"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!input.trim()) return;
                setSending(true);
                await sendMessage(activeRoom._id, input.trim());
                setInput('');
                setSending(false);
                setTyping(activeRoom._id, false);
              }}
            >
              <input
                ref={inputRef}
                className="flex-1 px-3 py-2 rounded-lg border border-amber-100 focus:ring-2 focus:ring-amber-400 text-sm outline-none"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={sending}
              />
              <AdminButton
                type="submit"
                variant="primary"
                loading={sending}
                disabled={sending || !input.trim()}
              >
                Send
              </AdminButton>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
