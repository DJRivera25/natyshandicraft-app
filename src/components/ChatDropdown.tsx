import React from 'react';
import { useChat } from './ChatProvider';
import { User, X, MessageCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

function timeAgo(date: string) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
}

export default function ChatDropdown({ onClose }: Props) {
  const { chatRooms, setActiveRoom, activeRoom } = useChat();

  return (
    <div className="absolute right-0 mt-2 w-80 max-w-xs sm:w-96 bg-white rounded-2xl shadow-2xl border border-amber-100 z-50 animate-fade-in overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
        <span className="font-semibold text-amber-900 text-base">Messages</span>
        <button
          className="p-1 rounded-full hover:bg-amber-100"
          aria-label="Close messages"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-amber-500" />
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto divide-y divide-amber-50">
        {chatRooms.length === 0 ? (
          <div className="p-6 text-center text-amber-700 text-sm flex flex-col items-center gap-2">
            <MessageCircle className="w-8 h-8 text-amber-200 mx-auto" />
            No conversations yet.
          </div>
        ) : (
          chatRooms.map((room) => {
            const last = room.lastMessage;
            const unread = last && !last.read && last.sender !== undefined;
            return (
              <button
                key={room._id}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${activeRoom?._id === room._id ? 'bg-amber-50' : 'bg-white hover:bg-amber-50/60'}`}
                onClick={() => {
                  setActiveRoom(room);
                  onClose();
                }}
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-amber-900 font-medium truncate">
                    {room.participants.length > 1 ? 'Chat' : 'You'}
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
    </div>
  );
}
