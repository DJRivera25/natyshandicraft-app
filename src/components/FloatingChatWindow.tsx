import React, { useRef, useEffect, useState } from 'react';
import { useChat } from './ChatProvider';
import { X, Send, Smile, Loader2, MessageCircle } from 'lucide-react';
import { createChatRoom } from '@/utils/api/chat';
import { getChatSupportAdmin } from '@/utils/api/user';
import { useSession } from 'next-auth/react';

function useDraggable(ref: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDragging = false;
    let startX = 0,
      startY = 0,
      origX = 0,
      origY = 0;
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = el.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;
      document.body.style.userSelect = 'none';
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      el.style.left = `${origX + e.clientX - startX}px`;
      el.style.top = `${origY + e.clientY - startY}px`;
    };
    const onMouseUp = () => {
      isDragging = false;
      document.body.style.userSelect = '';
    };
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [ref]);
}

export default function FloatingChatWindow({
  onClose,
  showWelcome = false,
}: {
  onClose: () => void;
  showWelcome?: boolean;
}) {
  const {
    activeRoom,
    messages,
    sendMessage,
    typingUsers,
    setTyping,
    setActiveRoom,
    chatRooms,
    markMessageAsRead,
  } = useChat();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useDraggable(chatRef as React.RefObject<HTMLDivElement>);
  const { data: session } = useSession();
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!activeRoom && chatRooms && chatRooms.length === 1) {
      setActiveRoom(chatRooms[0]);
    }
  }, [activeRoom, chatRooms, setActiveRoom]);

  useEffect(() => {
    if (activeRoom && messages.length > 0) {
      messages.forEach((msg) => {
        if (!msg.read && msg.sender !== session?.user?.id) {
          // Only mark as read if not already read and not sent by the user
          markMessageAsRead(msg._id);
        }
      });
    }
  }, [activeRoom, messages, session?.user?.id, markMessageAsRead]);

  // Show Messenger-like welcome if showWelcome is true and no messages
  if (showWelcome) {
    const handleStartConversation = async () => {
      // Fetch the chat support admin
      const admin = await getChatSupportAdmin();
      if (!admin) {
        alert('No chat support admin available.');
        return;
      }
      // Check if a room already exists with the admin
      const existingRoom = chatRooms?.find((room) =>
        room.participants.includes(admin._id)
      );
      if (existingRoom) {
        setActiveRoom(existingRoom);
        return;
      }
      // Create a new chat room with the admin
      const newRoom = await createChatRoom(admin._id);
      setActiveRoom(newRoom);
    };
    return (
      <div className="fixed z-[100] right-4 bottom-4 sm:right-8 sm:bottom-8 max-w-full flex flex-col items-end">
        <div
          ref={chatRef}
          className="w-[95vw] max-w-md sm:w-96 bg-white rounded-2xl shadow-2xl border border-amber-100 flex flex-col overflow-hidden animate-fade-in"
          style={{ position: 'relative', top: 0, left: 0, touchAction: 'none' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50 cursor-move select-none">
            <span className="font-semibold text-amber-900 text-base flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-amber-500" /> Chat with
              Admin
            </span>
            <button
              className="p-1 rounded-full hover:bg-amber-100"
              aria-label="Close chat"
              onClick={onClose}
            >
              <X className="w-5 h-5 text-amber-500" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-amber-50 text-center">
            <MessageCircle className="w-16 h-16 text-amber-200 mb-4" />
            <h2 className="text-xl font-bold text-amber-900 mb-2">
              How can we help you?
            </h2>
            <p className="text-amber-700 mb-4">
              Message our admin for any questions, order concerns, or feedback.
              We usually reply within a few minutes!
            </p>
            <button
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold shadow-lg transition-all"
              onClick={handleStartConversation}
              autoFocus
            >
              Start a Conversation
            </button>
          </div>
        </div>
        <div
          className="fixed inset-0 bg-black/30 z-[-1] sm:hidden"
          onClick={onClose}
        />
      </div>
    );
  }

  if (!activeRoom) return null;

  const handleSend = async () => {
    if (!input.trim()) return;
    setSending(true);
    await sendMessage(activeRoom._id, input.trim());
    setInput('');
    setSending(false);
    setTyping(activeRoom._id, false);
  };

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

  return (
    <div className="fixed z-[100] right-4 bottom-4 sm:right-8 sm:bottom-8 max-w-full flex flex-col items-end">
      <div
        ref={chatRef}
        className="w-[95vw] max-w-md sm:w-96 bg-white rounded-2xl shadow-2xl border border-amber-100 flex flex-col overflow-hidden animate-fade-in"
        style={{ position: 'relative', top: 0, left: 0, touchAction: 'none' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50 cursor-move select-none">
          <span className="font-semibold text-amber-900 text-base">Chat</span>
          <button
            className="p-1 rounded-full hover:bg-amber-100"
            aria-label="Close chat"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-amber-500" />
          </button>
        </div>
        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-amber-50"
          style={{ minHeight: 200, maxHeight: 350 }}
        >
          {messages.length === 0 ? (
            <div className="text-center text-amber-700 text-sm mt-8">
              No messages yet. Say hello!
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender === session?.user?.id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-xl px-4 py-2 max-w-[70%] text-sm shadow-md ${isMe ? 'bg-amber-500 text-white' : 'bg-white text-amber-900 border border-amber-100'}`}
                  >
                    {msg.content}
                    {msg.read && isMe && (
                      <span className="ml-2 text-xs text-green-500 align-bottom">
                        ✓✓
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
          {/* Typing indicator */}
          {Object.entries(typingUsers).some(
            ([userId, isTyping]) => isTyping && userId !== session?.user?.id
          ) && (
            <div className="flex items-center gap-2 text-xs text-amber-500 animate-pulse">
              <Smile className="w-4 h-4" /> Someone is typing...
            </div>
          )}
        </div>
        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-amber-100 bg-white">
          {/* Emoji picker button removed for now */}
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            disabled={sending}
          />
          <button
            className="p-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white transition disabled:opacity-50"
            onClick={handleSend}
            disabled={sending || !input.trim()}
            aria-label="Send message"
            type="button"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      {/* Fullscreen overlay for mobile */}
      <div
        className="fixed inset-0 bg-black/30 z-[-1] sm:hidden"
        onClick={onClose}
      />
    </div>
  );
}
