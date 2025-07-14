import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useChat } from './ChatProvider';
import ChatDropdown from './ChatDropdown';
import { useSession } from 'next-auth/react';

export default function MessageIcon({
  showChat = false,
}: {
  showChat?: boolean;
}) {
  const { data: session } = useSession();
  const { unreadCount } = useChat();
  const [open, setOpen] = useState(false);
  const iconRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (iconRef.current && !iconRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (!session?.user) return null;

  const effectiveUnreadCount = showChat ? 0 : unreadCount;

  return (
    <div className="relative">
      <button
        ref={iconRef}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-amber-50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
        aria-label="Messages"
        onClick={() => setOpen((v) => !v)}
      >
        <MessageCircle
          className={`w-6 h-6 ${effectiveUnreadCount > 0 ? 'text-amber-500 animate-bounce' : 'text-gray-400'}`}
        />
        {effectiveUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow-lg animate-pulse">
            {effectiveUnreadCount}
          </span>
        )}
      </button>
      {open && <ChatDropdown onClose={() => setOpen(false)} />}
    </div>
  );
}
